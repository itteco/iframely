(function() {

var _ = require('underscore');
var events = require('events');
var express = require('express');
var http = require('http');
var https = require('https');
var httpLink = require('http-link');
var url = require('url');
var sax = require('sax');

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
                var maxwidth = req.param('maxwidth');
                var maxheight = req.param('maxheight');

                var link = format && _.find(links, function(l) {return l.type.match(format);}) || links[0];

                var oembedUri = url.parse(link.href);

                var params = [];
                if (maxwidth) params.push('maxwidth=' + maxwidth);
                if (maxheight) params.push('maxheight=' + maxheight);

                if (params.length) {
                    oembedUri.path += (oembedUri.path.match('\\?')? '&': '?') + params.join('&');
                }

                oembedUri.headers = filterInHeaders(req.headers);

                getPage(oembedUri, function(oembedRes) {
                    if (oembedRes.statusCode == 200) {
                        if (!format || oembedRes.headers['content-type'].match(format)) {
                            res.writeHead(200, _.extend(filterOutHeaders(oembedRes.headers), COMMON_HEADERS));
                            oembedRes.pipe(res);

                        } else if (oembedRes.headers['content-type'].match('xml')) { // convert xml 2 json
                            xmlStream2json(oembedRes)
                                .on('error', function(error) {
                                    console.error('error', error);
                                    res.writeHead(500, 'Internal Server Error', COMMON_HEADERS);
                                    res.end();
                                })
                                .on('oembed', function(oembed) {
                                    res.writeHead(200, _.extend(filterOutHeaders(oembedRes.headers), {'Content-Type': 'application/json+oembed'}, COMMON_HEADERS));
                                    res.end(JSON.stringify(oembed));
                                });

                        } else { // convert json 2 xml
                            stream2json(oembedRes)
                                .on('error', function(error) {
                                    console.error('error', error);
                                    res.writeHead(500, 'Internal Server Error', COMMON_HEADERS);
                                    res.end();
                                })
                                .on('oembed', function(oembed) {
                                    res.writeHead(200, _.extend(filterOutHeaders(oembedRes.headers), {'Content-Type': 'application/xml+oembed'}, COMMON_HEADERS));
                                    res.write('<?xml version="1.0"?>\n');
                                    res.write('<oembed>\n');

                                    _.each(oembed, function(value, prop) {
                                        res.write('<' + prop + '>');
                                        res.write(value);
                                        res.write('</' + prop + '>');
                                    });

                                    res.end('</oembed>\n');
                                });
                        }

                    } else if (oembedRes.statusCode == 304) {
                        res.writeHead(304, COMMON_HEADERS);
                        res.end();

                    } else {
                        res.writeHead(404, COMMON_HEADERS);
                        res.end();
                    }

                }, 1).on('error', function(err) {
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

app.get('/iframe/1', function(req, res) {});

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
    
    if (typeof uri == 'string') {
        uri = url.parse(uri);
    }
    
    var handler = uri.protocol === 'http:'? https: http;
    handler.get({
        host: uri.hostname,
        port: uri.port,
        path: uri.path,
        headers: uri.headers
    }, function(res) {
        if (res.statusCode == 301 || res.statusCode == 302) {
            if (maxRedirects === 0) {
                req.emit('error', {error: 'max-redirects'});
                
            } else {
                var redirectUri = url.resolve(uri, res.headers.location);
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
}

app.listen(8060);
console.log('Listening', 8060);

})();
