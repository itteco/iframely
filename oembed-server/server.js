(function() {

var _ = require('underscore');
var events = require('events');
var http = require('http');
var httpLink = require('http-link');
var url = require('url');
var sax = require('sax');

var COMMON_HEADERS = {
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

var server = http.createServer(function(req, res) {
    var uri = url.parse(req.url, true);
    
    if (uri.pathname === '/oembed/1.0') {
        var pageUrl = decodeURIComponent(uri.query.url);
        console.log(new Date().toJSON(), 'get oembed for', pageUrl)
        getOembedLinks(pageUrl)
            .on('links', function(links) {
                if (links.length == 0) {
                    res.writeHead(404, COMMON_HEADERS);
                    res.end();
                    
                } else {
                    var format = uri.query.format;
                    var maxwidth = uri.query.maxwidth;
                    var maxheight = uri.query.maxheight;
                    
                    var link = format && _.find(links, function(l) { return l.type.match(format); }) || links[0];
                    
                    var oembedUri = url.parse(link.href);
                    
                    var params = [];
                    if (maxwidth) params.push('maxwidth=' + maxwidth);
                    if (maxheight) params.push('maxheight=' + maxheight);
                    
                    if (params.length) {
                        oembedUri.path += (oembedUri.path.match('\\?')? '&': '?') + params.join('&');
                    }
                    
                    var headers = filterInHeaders(req.headers);
                    
                    http.get({
                        host: oembedUri.hostname,
                        port: oembedUri.port,
                        path: oembedUri.path,
                        headers: headers
                    }, function(oembedRes) {
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
                        
                    }).on('error', function(err) {
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
        
    } else {
        res.writeHead(404);
        res.end();
    }
});


function filterHeaders(headers, allowed) {
    var filtered = {};
    
    allowed.forEach(function(header) {
        filtered[header] = headers[header.toLowerCase()];
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

    fetchPage(uri, promise);
    
    return promise;
}

function fetchPage(uri, promise) {
    var pageUrl = url.parse(uri);
    http.get({
        host: pageUrl.hostname,
        port: pageUrl.port,
        path: pageUrl.path
    }, function(pageRes) {
        if (pageRes.statusCode == 200) {
            var links = [];

            var linkHeaders = pageRes.headers.link;
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

            pageRes.pipe(saxStream);
            
        } else if (pageRes.statusCode == 301 || pageRes.statusCode == 302) {
            fetchPage(url.resolve(pageUrl, pageRes.headers.location), promise);
            
            
        } else {
            promise.emit('error', {error: true, code: pageRes.statusCode});
        }
        
    }).on('error', function(err) {
        console.error('error', err);
        promise.emit('error', err);
    });
        
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

server.listen(8060);
console.log('Listening', 8060);

})();
