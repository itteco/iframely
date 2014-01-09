var events = require('events');
var request = require('request');
var zlib = require('zlib');
var iconv = require('iconv-lite');

/**
 * @private
 * Get the oembed uri via known providers
 * @param {String} uri The page uri
 * @return {String} The oembed uri
 */
function lookupStaticProviders(uri) {
    var providers = require('../../providers.json');

    var protocolMatch = uri.match(/^(https?:\/\/)/);
    if (!protocolMatch) {
        return null;
    }
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

            uri = uri.replace(/#.+$/, "");

            var endpoint = p.endpoint;

            var groups = endpoint.match(/\{\d+\}/g);
            if (groups) {
                groups.forEach(function(g) {
                    var n = parseInt(g.match(/\{(\d+)\}/)[1]);
                    endpoint = endpoint.replace("{" + n + "}", match[n]);
                });

            } else if (endpoint.match(/\{url\}/)) {
                endpoint = endpoint.replace(/\{url\}/, encodeURIComponent(uri));

            } else {
                endpoint = endpoint + '?url=' + encodeURIComponent(uri);
            }

            links = ['json', 'xml'].map(function(format) {
                return {
                    href: endpoint.match(/\{format\}/)? endpoint.replace(/\{format\}/, format): endpoint + '&format=' + format,
                    rel: 'alternate',
                    type: 'application/' + format + '+oembed'
                };
            });
            break;
        }
    }

    return links;
}

module.exports.findOembedLinks = function(uri, meta) {
    // Filter oembed from meta.
    var alternate = meta && meta.alternate;
    if (alternate && !(alternate instanceof Array)) {
        alternate = [alternate];
        meta.alternate = alternate;
    }
    var oembedLinks = meta && meta.alternate && meta.alternate.filter(function(link) {
        return /^(application|text)\/(xml|json)\+oembed$/i.test(link.type);
    });

    if (!oembedLinks || !oembedLinks.length) {
        // Find oembed in static providers list.
        oembedLinks = lookupStaticProviders(uri);

        if (meta && oembedLinks) {
            // Merge found links to meta.
            meta.alternate = (meta.alternate || []).concat(oembedLinks);
        }
    }

    return oembedLinks;
}

/**
 * @private
 * Fetches and parses oEmbed by oEmbed URL got from discovery.
 * @param {String} uri Full oEmbed endpoint plus URL and any needed format parameter.
 * @param {Function} callback Completion callback function. The callback gets two arguments (error, oembed) where oembed is json parsed oEmbed object.
 * */
module.exports.getOembed = function(uri, callback) {

    getUrl(uri, {
        maxRedirects: 3
    })
        .on('response', function(res) {
            if (res.statusCode == 200) {

                stream2oembed(res, function(error, oembed) {
                    if (error) {
                        return callback(error);
                    }

                    var result = {};
                    for(var key in oembed) {
                        var goodKey = key.replace(/-/g, "_");
                        result[goodKey] = oembed[key];
                    }

                    callback(null, result);
                });

            } else {
                callback(res.statusCode);
            }
        })
        .on('error', callback);
}

/**
 * @private
 * Convert XML or JSON stream to an oEmbed object.
 */
function stream2oembed(stream, callback) {
    stream.headers['content-type'].match('xml') ?
        xmlStream2oembed(stream, callback) :
        jsonStream2oembed(stream, callback);
}

/**
 * @private
 * Convert XML stream to an oembed object
 */
function xmlStream2oembed(stream, callback) {
    var oembed;
    var prop;
    var value;
    var firstTag;

    var charset = getCharset(stream.headers && stream.headers['content-type']);

    var saxStream = sax.createStream();
    saxStream.on('error', function(err) {
        callback(err);
    });
    saxStream.on('opentag', function(tag) {
        if (!firstTag) {
            // Should be HEAD but HASH tag found on qik.
            firstTag = tag.name;
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
        if (name === firstTag) {
            callback(null, oembed);

        } else {
            if (prop) {
                value = encodeText(charset, value);

                if (prop.match(/(width|height)$/)) {

                    if (value.match(/^\d+(px)?$/)) {
                        value = parseInt(value, 10);
                    } else {
                        // For case like 100%.
                        value = undefined;
                    }
                }

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

    var charset = getCharset(stream.headers && stream.headers['content-type']);

    var data = "";
    stream.on('data', function(chunk) {
        data += chunk;
    }).on('end', function() {
            try {
                data = JSON.parse(encodeText(charset, data));
            } catch (e) {
                callback(e);
                return;
            }

            for(var prop in data) {

                var value = data[prop];

                if (prop.match(/(width|height)$/) && (typeof value === "string")) {

                    if (value.match(/^\d+(px)?$/)) {
                        value = parseInt(value, 10);
                        data[prop] = value;
                    } else {
                        // For case like 100%.
                        data[prop] = undefined;
                    }
                }
            }

            lowerCaseKeys(data);

            callback(null, data);
        });
}

/**
 * @private
 * Do HTTP GET request and handle redirects
 * @param url Request uri (parsed object or string)
 * @param {Object} options
 * @param {Number} [options.maxRedirects]
 * @param {Boolean} [options.fullResponse] True if need load full page response. Default: false.
 * @param {Function} [callback] The completion callback function or events.EventEmitter object
 * @returns {events.EventEmitter} The emitter object which emit error or response event
 */
function getUrl(url, options) {

    var req = new events.EventEmitter();

    var jar = options.jar;

    if (!jar) {
        jar = request.jar();
    }

    var buffer = [];
    function bindBodyGetter(stream) {
        stream.on('data', function(chunk) {
            buffer.push(chunk);
        });
        stream.on('end', function() {
            body = buffer.join('');
            req.emit('complete', body);
        });
    }

    process.nextTick(function() {
        try {

            var supportGzip = !process.version.match(/^v0\.8/);

            var r = request({
                uri: url,
                method: 'GET',
                headers: {
                    'User-Agent': CONFIG.USER_AGENT,
                    'Accept-Encoding': supportGzip ? 'gzip,deflate' : ''
                },
                maxRedirects: options.maxRedirects,
                timeout: options.timeout,
                jar: jar
            })
                .on('error', function(error) {
                    req.emit('error', error);
                })
                .on('response', function(res) {

                    if (supportGzip && ['gzip', 'deflate'].indexOf(res.headers['content-encoding']) > -1) {

                        var gunzip = zlib.createUnzip();
                        gunzip.request = res.request;
                        gunzip.statusCode = res.statusCode;
                        gunzip.headers = res.headers;

                        if (!options.asBuffer) {
                            gunzip.setEncoding("binary");
                        }

                        if (options.fullResponse) {
                            bindBodyGetter(gunzip);
                        }

                        req.emit('response', gunzip);

                        res.pipe(gunzip);


                    } else {

                        if (!options.asBuffer) {
                            res.setEncoding("binary");
                        }

                        if (options.fullResponse) {
                            bindBodyGetter(res);
                        }

                        req.emit('response', res);
                    }
                });

            req.emit('request', r);

        } catch (ex) {
            console.error('Error on getUrl for', url, '.\n Error:' + ex);
            req.emit('error', ex);
        }
    });
    return req;
}

// TODO: need reuse.

function getCharset(string, doNotParse) {
    var charset;

    if (doNotParse) {
        charset = string.toUpperCase();
    } else if (string) {
        var m = string && string.match(/charset\s*=\s*([\w_-]+)/i);
        charset = m && m[1].toUpperCase();
    }

    if (charset && charset === 'UTF-8')
        charset = null;

    return charset;
}

function encodeText(charset, text) {
    try {
        var b = iconv.encode(text, "ISO8859-1");
        return iconv.decode(b, charset || "UTF-8");
    } catch(e) {
        return text;
    }
}

function lowerCaseKeys(obj) {
    for (var k in obj) {
        var lowerCaseKey = k.toLowerCase();
        if (lowerCaseKey != k) {
            obj[lowerCaseKey] = obj[k];
            delete obj[k];
            k = lowerCaseKey;
        }
        if (typeof obj[k] == "object") {
            lowerCaseKeys(obj[k]);
        }
    }
}