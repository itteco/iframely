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

var Iconv = require('iconv').Iconv;

var NodeCache = require('node-cache');

var linksCache = new NodeCache();

var oembedsCache = new NodeCache();

var opengraphCache = new NodeCache();

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
        console.log('static', links);
        callback(null, links);
        
    } else {
        withCache(options.useCache !== false && linksCache, uri, 300, function(callback) { 
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
                    parseLinks(saxStream, function(error, links) {
                        if (error) {
                            callback(error);

                        } else {
                            links = links.filter(isOembed);
                            links.forEach(function(link) {
                                link.href = url.resolve(uri, link.href);
                            });
                            callback(null, links);
                        }
                    });

                    res.pipe(saxStream);

                } else {
                    callback({error: true, code: res.statusCode});
                }
            }, 3).on('error', function(error) {
                callback(error);
            });
        }, callback);
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
 * @param {Boolean} [options.useCache=true] Use cache for this request
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
 * @public
 * Query Open Graph meta for the given page
 * @param uri The page uri
 * @param {Object} [options] The request options
 * @param {Boolean} [options.useCache=true] Use cache for this request
 * @param {Function} callback The completion callback function. The callback gets two arguments (err, og) where og is an object.
 * @example callback(null, {title: 'abc', url: 'http://example.com/', image: '/adsawq'});
 */
iframely.queryOpenGraph = function(uri, options, callback) {
    if (typeof options == 'function') {
        callback = options;
        options = {};
    }
    
    options = options || {};
    
    withCache(options.useCache !== false && opengraphCache, uri, 300, function(callback) {
        uri.headers = {'Accept': 'text/html', 'User-Agent': 'curl/1.1'};
        getPage(uri, function(res) {
            if (res.statusCode == 200) {
                res.setEncoding('binary');
                
                var saxStream = sax.createStream(false);
                saxStream.contentType = res.headers['content-type'];
                parseOpenGraph(saxStream, callback);
                res.pipe(saxStream);

            } else {
                callback({error: true, code: res.statusCode});
            }
        }, 3).on('error', function(error) {
            callback(error);
        });
    }, callback);
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
    var uri2 = uri.substr(protocolMatch[1].length);

    var links;
    
    for (var j = 0; j < providers.length; j++) {
        var p = providers[j];
        var match;
        for (var i = 0; i < p.templates.length; i++) {
            match = uri2.match(p.templates[i]);
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

/**
 * @private
 * Convert XML stream to an oembed object
 */
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
                if (prop.match(/(width|height)$/))
                    value = parseInt(value);
                
                oembed[prop] = value;
            }
            prop = null;
        }
    });

    stream.pipe(saxStream);
}

/**
 * @private
 * Convert JSON stream to an oembed object
 */
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

/**
 * @private
 * Convert XML or JSON stream to an oembed object
 */
function stream2oembed(callback) {
    this.headers['content-type'].match('xml')?
        xmlStream2oembed(this, callback):
        jsonStream2oembed(this, callback)
}

/**
 * @private
 * Parse Link tags on page
 */
function parseLinks(saxStream, callback) {
    var links = [];
    
    var end = true;
    
    saxStream.on('error', function(err) {
        if (end) return;
        
        console.log('sax error', err);
        callback(err);
        end = true;
    });
    saxStream.on('opentag', function(tag) {
        if (end) return;
        
        if (tag.name === 'LINK' && isOembed(tag.attributes)) {
            links.push(tag.attributes);
        }
    });
    saxStream.on('closetag', function(name) {
        if (end) return;
        
        if (name === 'HEAD') {
            callback(null, links);
            end = true;
        }
    });
    saxStream.on('end', function() {
        if (end) return;
        
        callback(null, links);
        end = true;
    });
}

/**
 * @private
 * Parse Open Graph meta on page
 */
function parseOpenGraph(saxStream, callback) {
    var utf8_iso8859_1 = new Iconv('UTF-8', 'ISO8859-1');
    var charset = getCharset(saxStream.contentType);
    
    var prefixes;
    
    var rootProp = {
        prefix: 'og:',
        value: {}
    };
    
    var prop = rootProp;
    var stack = [];
    
    function _merge(parentProp, prop) {
        if (typeof parentProp.value == 'string') {
            if (parentProp.property == 'audio' || parentProp.property == 'image' || parentProp.property == 'video') {
                parentProp.value = {
                    url: parentProp.value
                };
                
            } else {
                parentProp.value = {
                    value: parentProp.value
                };
            }
        }
        
        if (!(prop.property in parentProp.value)) {
            parentProp.value[prop.property] = prop.value;

        } else if (_.isArray(parentProp.value[prop.property])) {
            parentProp.value[prop.property].push(prop.value);

        } else {
            parentProp.value[prop.property] = [parentProp.value[prop.property], prop.value];
        }
    }
    
    function _finalMerge() {
        while (stack.length > 0) {
            var parentProp = stack.shift();
            _merge(parentProp, prop);
            prop = parentProp;
        }
    }
    
    var end = false;
    saxStream.on('error', function(err) {
        if (end) return;
        
        console.log('sax error', err);
        callback(err);
        end = true;
    });
    saxStream.on('opentag', function(tag) {
        if (end) return;
        
        if (tag.name === 'META') {
            var metaTag = tag.attributes;
            
            if ('property' in metaTag && metaTag.property.match(/^og:/)) {
                console.log(metaTag.property, metaTag.content);
                while (metaTag.property.substr(0, prop.prefix.length) != prop.prefix) {
                    var parentProp = stack.shift();
                    _merge(parentProp, prop);
                    prop = parentProp;
                }
                
                var property = metaTag.property.substr(prop.prefix.length);
                var propertyParts = property.split(':');
                
                while (propertyParts.length > 0) {
                    stack.unshift(prop);
                    var name = propertyParts.shift();
                    prop = {
                        prefix: prop.prefix + name + ':',
                        property: name,
                        value: {}
                    };
                }
                
                if (prop.property == 'height' || prop.property == 'width')
                    metaTag.content = parseInt(metaTag.content);
                
                if (charset) {
                    metaTag.content = charset.convert(utf8_iso8859_1.convert(metaTag.content)).toString();
                }
                
                prop.value = metaTag.content;
                
            } else if (metaTag['http-equiv'] &&  metaTag['http-equiv'].toLowerCase() == 'content-type') {
                charset = getCharset(metaTag.content);
            }
            
        } else if (tag.name == 'HEAD') {
            var headTag = tag.attributes;
            if (headTag.prefix) {
                prefixes = {};
                var prefixParts = headTag.prefix.split(/\s+/);
                for (var i = 0; i < prefixParts.length; i += 2) {
                    var prefix = prefixParts[i];
                    if (prefixParts[i + 1] == 'http://ogp.me/ns#') {
                        rootProp.prefix = prefix;
                        
                    } else {
                        prefixes[prefix.substr(0, prefix.length - 1)] = prefixParts[i + 1];
                    }
                }
            }
        }
    });
    saxStream.on('closetag', function(name) {
        if (end) return;
        
        if (name === 'HEAD') {
            _finalMerge();
            if (prefixes)
                rootProp.value.namespaces = prefixes;
            callback(null, rootProp.value);
            end = true;
        }
    });
    saxStream.on('end', function() {
        if (end) return;
        
        _finalMerge();
        callback(null, rootProp.value);
        end = true;
    });
}

/**
 * @private
 * 
 */
function withCache(cache, key, timeout, func, callback) {
    if (!cache) {
        func(callback);
        
    } else {
        cache.get(key, function(error, data) {
            if (!error && data && key in data) {
                callback(null, data[key]);

            } else {
                func(function(error, data) {
                    if (error) {
                        callback(error);

                    } else {
                        cache.set(key, data, timeout);
                        callback(error, data);
                    }
                });
            }
        });
    }
}

/**
 * @private
 */
function getCharset(string) {
    var m = string && string.match(/charset=([\w-]+)/i);
    var charset = m && m[1].toUpperCase();
    if (charset && charset.toLowerCase() == 'utf-8')
        charset = null;
    
    if (charset) {
        console.log('charset', charset);
        return new Iconv(charset, 'UTF-8');
    }
    
    return null;
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
