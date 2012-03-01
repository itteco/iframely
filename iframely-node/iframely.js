(function(iframely) {

var _ = require('underscore');
var events = require('events');
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

/**
 * @public
 * Fetches oembed links for the given page uri
 * @param {String} uri The page uri
 * @param {Object} [options] The request options
 * @param {Boolean} [options.useCache=true] Use cache for this request
 * @param {Function} callback Completion callback function. The callback gets two arguments (err, links) where links is an array of objects.
 * @example callback(null, [{href: 'http://example.com/oembed?url=http://example.com/article.html', type: 'application/json+oembed'}])
 */
iframely.getOembedLinks = function(uri, options, callback) {
    if (typeof options == 'function') {
        callback = options;
        options = {};
    }
    
    options = options || {};
    
    var links = lookupStaticProviders(uri);
    if (links) {
        callback(null, links);
        
    } else {
        linksCache.get(uri, function(error, data) {
            if (!error && data && uri in data) {
                callback(null, data[uri]);
                
            } else {
                getPage(uri, function(res) {
                    if (res.statusCode == 200) {
                        var links = [];

                        var linkHeaders = res.headers.link;
                        if (linkHeaders) {
                            if (typeof linkHeaders === 'string')
                                linkHeaders = [linkHeaders];
                            
                            links = linkHeaders.reduce(function(links, value) {
                                return links.concat(httpLink.parse(value).filter(isOembed));
                            }, []);
                            
                            links.forEach(function(link) {
                                link.href = url.resolve(uri, link.href);
                            });

                            if (links.length) {
                                callback(null, links);
                                return;
                            }
                        }

                        var saxStream = sax.createStream(false);

                        var end = false;
                        saxStream.on('error', function(err) {
                            console.log('sax error', err);
                            callback(error);
                        });
                        saxStream.on('opentag', function(tag) {
                            if (tag.name === 'LINK' && isOembed(tag.attributes)) {
                                links.push(tag.attributes);
                            }
                        });
                        saxStream.on('closetag', function(name) {
                            if (name === 'HEAD') {
                                links.forEach(function(link) {
                                    link.href = url.resolve(uri, link.href);
                                });
                                if (options.useCache !== false) {
                                    linksCache.set(uri, links, 300);
                                }
                                callback(null, links);
                                end = true;
                            }
                        });
                        saxStream.on('end', function() {
                            if (!end) {
                                callback(null, links);
                                end = true;
                            }
                        });

                        res.pipe(saxStream);

                    } else {
                        callback({error: true, code: res.statusCode});
                    }
                }, 3).on('error', function(error) {
                    callback(error);
                });
            }
        });
    }
};

/*
 * @public
 * Fetches oembed for the given oembed uri
 * @param {String} uri The oembed direct uri
 * @param {Object} [options] The request options
 * @param {Number} [options.maxwidth] The maximum width of the embedded resource
 * @param {Number} [options.maxheight] The maximum height of the embedded resource
 * @param {Object} [options.headers] Additional headers
 * @param {String} [options.type=stream] (string, stream, object)
 * @param {Function} callback Completion callback function. The callback gets two arguments (err, oembed) where oembed is an object.
 * @example callback(null, {version: '1.0', type: 'rich', html: '...'})
 */
iframely.getOembedByProvider = function(uri, options, callback) {
    var oembedUri = url.parse(uri);
    
    if (typeof options == 'function') {
        callback = options;
        options = {};
    }
    
    options = options || {};

    var type = options.type || 'stream';
    
    var params = [];
    if (options.maxwidth) params.push('maxwidth=' + options.maxwidth);
    if (options.maxheigth) params.push('maxheight=' + options.maxheigth);
    
    if (params.length) {
        if (oembedUri.search)
            oembedUri.search += '&' + params.join('&');
        
        else
            oembedUri.search = '?' + params.join('&');
    }
    
    var cacheKey = url.format(oembedUri);
    oembedsCache.get(cacheKey, function(error, data) {
        if (!error && data && cacheKey in data) {
            var oembedData = data[cacheKey];

            if (type === 'string') {
                callback(null, oembedData.data);
                
            } else if (type === 'stream') {
                var res = new ProxyStream();
                res.headers = oembedData.headers;
                res.toOembed = stream2oembed;
                res.oembedUrl = cacheKey;
                res.statusCode = 200;
                callback(null, res);
                process.nextTick(function() {
                    res.end(oembedData.data);
                });
                
            } else { // type === 'object''
                var res = new ProxyStream();
                res.headers = oembedData.headers;
                res.toOembed = stream2oembed;
                res.toOembed(callback);
                process.nextTick(function() {
                    res.end(oembedData.data);
                });
            }

        } else {
            oembedUri.headers = options.headers;

            getPage(oembedUri, function(res) {
                if (res.statusCode == 200) {
                    res.toOembed = stream2oembed;
                    res.oembedUrl = cacheKey;
                    
                    if (options.useCache !== false) {
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
                    }
                    
                    if (type === 'stream') {
                        callback(null, res);
                        
                    } else if (type === 'string') {
                        var data = '';
                        res.on('data', function(chunk) {
                            data += chunk;
                        });
                        res.on('end', function() {
                            callback(null, data);
                        });
                        
                    } else { // type='object'
                        res.toOembed(callback);
                    }
                    
                } else if (res.statusCode == 304) {
                    callback({error: 'not-modified'});
                    
                } else {
                    callback({error: 'not-found'});
                }
                
            }, 1).on('error', function(error) {
                callback(error);
            });
        }
    });
};

/**
 * @public
 * Get oembed object for the given uri
 * @param {String} uri The page uri
 * @param {Object} [options] The request options
 * @param {String} [options.format] The requested format (json or xml)
 * @param {Number} [options.maxwidth] The maximum width of the embedded resource
 * @param {Number} [options.maxheight] The maximum height of the embedded resource
 * @param {Object} [options.headers] Additional headers
 * @param {String} [options.type=stream] (string, stream, object)
 * @param {Function} callback The completion callback function. The callback gets two arguments (err, oembed) where oembed is an object.
 * @example callback(null, {version: '1.0', type: 'rich', html: '...'})
 */
iframely.getOembed = function(uri, options, callback) {
    if (typeof options == 'function') {
        callback = options;
        options = {};
    }
    
    options = options || {};

    iframely.getOembedLinks(uri, options, function(error, links) {
        if (error) {
            callback(error);

        } else if (links.length == 0) {
            callback({error: 'not-found'});

        } else {
            var format = options.format;

            var link = format && _.find(links, function(l) {return l.type.match(format);}) || links[0];

            iframely.getOembedByProvider(link.href, options, callback);
        }        
    });
};

/**
 * @private
 * Test the link for oembed
 * @param {Object} link The link object in form {href: 'http://example.com/oembed?url=...', type: 'application/json+oembed'}
 * @return {Boolean} true for oembed link
 */
function isOembed(link) {
    return link.type === 'application/json+oembed' || link.type === 'application/xml+oembed' || link.type === 'text/xml+oembed';
} 

/**
 * @private
 * Get the oembed uri via known providers
 * @param {String} uri The page uri
 * @return {String} The oembed uri
 */
function lookupStaticProviders(uri) {
    var providers = require('./providers.json');
    
    var protocolMatch = uri.match(/^(https?:\/\/)/);
    uri = uri.substr(protocolMatch[1].length);

    var links;
    
    for (var j = 0; j < providers.length; j++) {
        var p = providers[j];
        var match;
        for (var i = 0; i < p.templates.length; i++) {
            match = uri.match(p.templates[i]);
            if (match) break;
        }
        
        if (match) {
            var endpoint = p.endpoint;
            if (endpoint.match(/\{1\}/)) {
                endpoint = endpoint.replace(/\{1\}/, match[1]);
                
            } else if (endpoint.match(/\{url\}/)) {
                endpoint = endpoint.replace(/\{url\}/, encodeURIComponent(uri))
                
            } else {
                endpoint = endpoint + '?url=' + encodeURIComponent(uri)
            }
            
            links = ['json', 'xml'].map(function(format) {
                return {
                    href: endpoint.match(/\{format\}/)? endpoint.replace(/\{format\}/, format): endpoint + '&format=' + format,
                    rel: 'alternate',
                    type: 'application/' + format + '+oembed'
                }
            });
            break;
        }
    }
    
    return links;
}

/**
 * @private
 * Do HTTP GET request and handle redirects
 * @param uri Request uri (parsed object or string)
 * @param callback The completion callback function or events.EventEmitter object
 * @param {Number} [maxRedirects] The maximum count of redirects.
 * @returns {events.EventEmitter} The emmiter object which emit error or response event
 */
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
    
    var handler = parsedUri.protocol === 'https:'? https: http;
    handler.get({
        host: parsedUri.hostname,
        port: parsedUri.port,
        path: parsedUri.pathname + (parsedUri.search || ''),
        headers: uri.headers
    }, function(res) {
        if (res.statusCode == 301 || res.statusCode == 302) {
            if (maxRedirects === 0) {
                req.emit('error', new Error('too many redirects'));
                
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

function xmlStream2oembed(stream, callback) {
    var oembed;
    var prop;
    var value;

    var saxStream = sax.createStream();
    saxStream.on('error', function(err) {
        callback(err);
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
            callback(null, oembed);
            
        } else {
            if (prop) {
                oembed[prop] = value;
            }
            prop = null;
        }
    });

    stream.pipe(saxStream);
}

function jsonStream2oembed(stream, callback) {
    var data = "";
    stream.on('data', function(chunk) {
        data += chunk;
        
    }).on('end', function() {
        try {
            data = JSON.parse(data);
            
        } catch (e) {
            callback(e);
            return;
        }
        
        callback(null, data);
    });
}

function stream2oembed(callback) {
    this.headers['content-type'].match('xml')?
        xmlStream2oembed(this, callback):
        jsonStream2oembed(this, callback)
}

/**
 * Creates a new proxy stream
 * @constructor
 * @extends stream.Stream
 */
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

})(exports);
