(function() {

var _ = require('underscore');
var events = require('events');
var express = require('express');
var http = require('http');
var https = require('https');
var httpLink = require('http-link');
var sax = require('sax');
var stream = require('stream');
var url = require('url');
var util = require('util');

var NodeCache = require('node-cache');

var linksCache = new NodeCache();

var oembedsCache = new NodeCache();

const COMMON_HEADERS = {
    'Access-Control-Allow-Origin': '*'
};

const ALLOWED_IN_HEADERS = [
    'If-Modified-Since',
    'If-None-Match',
];

const ALLOWED_OUT_HEADERS = [
    'Content-Description',
    'Content-Type',
    'ETag',
    'Expires',
    'Last-Modified'
];

var app = express.createServer(
    express.logger()
//    express.bodyParser()
);

app.get('/oembed/1', function(req, res) {
    var pageUrl = decodeURIComponent(req.param('url'));
    getOembedLinks(pageUrl)
        .on('links', function(links) {
            if (links.length == 0) {
                res.writeHead(404, COMMON_HEADERS);
                res.end();

            } else {
                var format = req.param('format');
                var iframe = req.param('iframe');

                var link = format && _.find(links, function(l) {return l.type.match(format);}) || links[0];

                var options = {
                    maxwidth: req.param('maxwidth'),
                    maxheight: req.param('maxheight'),
                    headers: filterInHeaders(req.headers)
                };

                getOembed(link.href, options, function(oembedRes) {
                    if ((!format || oembedRes.headers['content-type'].match(format)) && !iframe) {
                        res.writeHead(200, _.extend(filterOutHeaders(oembedRes.headers), COMMON_HEADERS));
                        oembedRes.pipe(res);

                    } else {
                        var stream = oembedRes.headers['content-type'].match('xml')?
                            xmlStream2json(oembedRes):
                            stream2json(oembedRes)

                        stream
                            .on('error', function(error) {
                                console.error('error', error);
                                res.writeHead(500, 'Internal Server Error', COMMON_HEADERS);
                                res.end();
                            })
                            .on('oembed', function(oembed) {
                                if (iframe) {
                                    oembed.html = '<iframe src="http://iframe.ly/iframe/1?url=' + encodeURIComponent(oembedRes.oembedUrl) + '></iframe>';
                                }
                                
                                if (format == 'json') {
                                    res.writeHead(200, _.extend(filterOutHeaders(oembedRes.headers), {'Content-Type': 'application/json+oembed'}, COMMON_HEADERS));
                                    res.end(JSON.stringify(oembed));
                                    
                                } else {
                                    res.writeHead(200, _.extend(filterOutHeaders(oembedRes.headers), {'Content-Type': 'application/xml+oembed'}, COMMON_HEADERS));
                                    res.write('<?xml version="1.0"?>\n');
                                    res.write('<oembed>\n');

                                    _.each(oembed, function(value, prop) {
                                        res.write('<' + prop + '>');
                                        res.write(value);
                                        res.write('</' + prop + '>');
                                    });

                                    res.end('</oembed>\n');
                                }
                            });
                    }

                }, 1)
                .on('not-modified', function() {
                    res.writeHead(304, COMMON_HEADERS);
                    res.end();
                })
                .on('not-found', function() {
                    res.writeHead(404, COMMON_HEADERS);
                    res.end();
                })
                .on('error', function(err) {
                    console.error('error', err);
                    res.writeHead(500, 'Internal Server Error', COMMON_HEADERS);
                    res.end();
                });
            }
        })
        .on('error', function() {
            res.writeHead(500, 'Internal Server Error', COMMON_HEADERS);
            res.end();
        });
});

app.get('/iframe/1', function(req, res) {
    var oembedUrl = decodeURIComponent(req.param('url'));
    getOembed(oembedUrl, {}, function(oembedRes) {
        var stream = oembedRes.headers['content-type'].match('xml')?
            xmlStream2json(oembedRes):
            stream2json(oembedRes)
        
        stream.on('error', function(error) {
            console.error('error', error);
            res.writeHead(500);
            res.end();
        })
        .on('oembed', function(oembed) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(oembed.html);
        });
        
    }).on('not-found', function() {
        res.writeHead(404);
        res.end();
        
    }).on('error', function(error) {
        console.log(error);
        res.writeHead(500);
        res.end();
    });
});

function filterHeaders(headers, allowed) {
    var filtered = {};
    
    allowed.forEach(function(header) {
        var key = header.toLowerCase();
        if (key in headers)
            filtered[header] = headers[key];
    });
    
    return filtered;
}

function filterInHeaders(headers) {
    return filterHeaders(headers, ALLOWED_IN_HEADERS);
}

function filterOutHeaders(headers) {
    return filterHeaders(headers, ALLOWED_OUT_HEADERS);
}

function isOembed(link) {
    return link.type === 'application/json+oembed' || link.type === 'application/xml+oembed' || link.type === 'text/xml+oembed';
} 

/**
 * Fetches oembed link for the given uri
 * @return event emitter object
 */
function getOembedLinks(uri) {
    var promise = new events.EventEmitter();
    
    var links = lookupStaticProviders(uri);
    if (links) {
        process.nextTick(function() {
            promise.emit('links', links);
        });
        
    } else {
        linksCache.get(uri, function(error, data) {
            if (!error && data && uri in data) {
                process.nextTick(function() {
                    promise.emit('links', data[uri]);
                });
                
            } else {
                getPage(uri, function(res) {
                    if (res.statusCode == 200) {
                        var links = [];

                        var linkHeaders = res.headers.link;
                        if (linkHeaders) {
                            links = links.reduce(function(links, value) {
                                return links.concat(httpLink.parse(value).filter(isOembed));
                            }, []);

                            if (links.length) {
                                promise.emit('links', links);
                                return;
                            }
                        }

                        var saxStream = sax.createStream(false);

                        var end = false;
                        saxStream.on('error', function(err) {
                            console.log('sax error', err);
                            promise.emit('error', err);
                        });
                        saxStream.on('opentag', function(tag) {
                            if (tag.name === 'LINK' && isOembed(tag.attributes)) {
                                links.push(tag.attributes);
                            }
                        });
                        saxStream.on('closetag', function(name) {
                            if (name === 'HEAD') {
                                linksCache.set(uri, links, 300);
                                promise.emit('links', links);
                                end = true;
                            }
                        });
                        saxStream.on('end', function() {
                            if (!end) {
                                promise.emit('links', links);
                                end = true;
                            }
                        });

                        res.pipe(saxStream);

                    } else {
                        promise.emit('error', {error: true, code: res.statusCode});
                    }
                }, 3);
            }
        });
    }
    
    return promise;
}

function getOembed(uri, options, callback) {
    var promise = new events.EventEmitter();
    if (callback) {
        promise.on('response', callback);
    }
    
    var oembedUri = url.parse(uri);

    var params = [];
    if (options.maxwidth) params.push('maxwidth=' + options.maxwidth);
    if (options.maxheigth) params.push('maxheight=' + options.maxheigth);

    if (params.length) {
        oembedUri.path += (oembedUri.path.match('\\?')? '&': '?') + params.join('&');
    }
    
    var cacheKey = url.format(oembedUri);
    oembedsCache.get(cacheKey, function(error, data) {
        if (!error && data && cacheKey in data) {
            process.nextTick(function() {
                var oembedData = data[cacheKey];

                var res = new ProxyStream();
                res.oembedUrl = cacheKey;
                res.statusCode = 200;
                res.headers = oembedData.headers;
                promise.emit('response', res);
                process.nextTick(function() {
                    res.end(oembedData.data);
                });
            });

        } else {
            oembedUri.headers = options.headers;

            getPage(oembedUri, function(res) {
                if (res.statusCode == 200) {
                    res.oembedUrl = cacheKey;
                    var headers = {};
                    for (var prop in res.headers) {
                        headers[prop] = res.headers[prop];
                    }
                    var oembedData = {
                        headers: headers,
                        data: ''
                    };
                    res.on('data', function(data) {
                        oembedData.data += data;
                    });
                    res.on('end', function() {
                        oembedsCache.set(cacheKey, oembedData, 3600);
                    });
                    
                    promise.emit('response', res);
                    
                } else if (res.statusCode == 304) {
                    promise.emit('not-modified');
                    
                } else {
                    promise.emit('not-found');
                }
                
                
            }).on('error', function(error) {
                promise.emit('error', error);
            });
        }
    });
    
    return promise;
}

function lookupStaticProviders(uri) {
    var providers = require('./providers.json');
    
    var protoMatch = uri.match(/^(https?:\/\/)/);
    uri = uri.substr(protoMatch[1].length);
    
    var links;
    for (var j = 0; j < providers.length; j++) {
        var p = providers[j];
        var match;
        for (var i = 0; i < p.templates.length; i++) {
            match = uri.match(p.templates[i]);
            if (match) break;
        }
        
        if (match) {
            links = p.links.map(function(l) {
                return {
                    href: l.href.replace('{part1}', match[1]),
                    rel: 'alternate',
                    type: l.type
                }
            });
            break;
        }
    }
    
    return links;
}

function getPage(uri, callback, maxRedirects) {
    var req = callback instanceof events.EventEmitter? callback: new events.EventEmitter();
    
    if (typeof callback === 'function') {
        req.on('response', callback);
    }
    
    var parsedUri
    if (typeof uri == 'string') {
        parsedUri = url.parse(uri);
        
    } else {
        parsedUri = uri;
    }
    
    var handler = uri.protocol === 'http:'? https: http;
    handler.get({
        host: parsedUri.hostname,
        port: parsedUri.port,
        path: parsedUri.path,
        headers: uri.headers
    }, function(res) {
        if (res.statusCode == 301 || res.statusCode == 302) {
            if (maxRedirects === 0) {
                req.emit('error', {error: 'max-redirects'});
                
            } else {
                var redirectUri = url.resolve(parsedUri, res.headers.location);
                redirectUri.headers = uri.headers;
                getPage(redirectUri, req, maxRedirects > 0? maxRedirects - 1: maxRedirects);
            }
            
        } else {
            req.emit('response', res);
        }
        
    }).on('error', function(error) {
        req.emit('error', error);
    });
    
    return req;
}

function xmlStream2json(stream) {
    var promise = new events.EventEmitter();

    var oembed;
    var prop;
    var value;

    var saxStream = sax.createStream();
    saxStream.on('error', function(err) {
        promise.emit('error', err);
    });
    saxStream.on('opentag', function(tag) {
        if (tag.name === 'OEMBED') {
            oembed = {};
            
        } else if (oembed) {
            prop = tag.name.toLowerCase();
            value = "";
        }
    });
    saxStream.on('text', function(text) {
        if (prop) value += text;
    });
    saxStream.on('cdata', function(text) {
        if (prop) value += text;
    });
    saxStream.on('closetag', function(name) {
        if (name === 'OEMBED') {
            promise.emit('oembed', oembed);
            
        } else {
            if (prop) {
                oembed[prop] = value;
            }
            prop = null;
        }
    });

    stream.pipe(saxStream);
    
    return promise;
}

function stream2json(stream) {
    var promise = new events.EventEmitter();

    var data = "";
    stream.on('data', function(chunk) {
        data += chunk;
        
    }).on('end', function() {
        try {
            data = JSON.parse(data);
            
        } catch (e) {
            promise.emit('error', e);
            return;
        }
        
        promise.emit('oembed', data);
    });
    
    return promise;
}

function ProxyStream() {
    this.readable = true;
}

util.inherits(ProxyStream, stream.Stream);

ProxyStream.prototype.write = function(data) {
    this.emit('data', data);
};

ProxyStream.prototype.end = function(data) {
    if (data)
        this.emit('data', data);
    this.emit('end');
};

ProxyStream.prototype.pause = function() {
    this.emit('pause');
};

ProxyStream.prototype.resume = function() {
    this.emit('resume');
};

app.listen(8060);
console.log('Listening', 8060);

})();
