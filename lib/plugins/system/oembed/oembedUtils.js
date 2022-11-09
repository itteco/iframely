import sax from 'sax';
import * as urlLib from 'url';
import * as async from 'async';
import * as utils from '../../../utils.js';
import log from '../../../../logging.js';
import { cache } from '../../../cache.js';
import { readFile } from 'fs/promises';

var getUrlFunctional = utils.getUrlFunctional;
var getCharset = utils.getCharset;
var encodeText = utils.encodeText;
var lowerCaseKeys = utils.lowerCaseKeys;

export const notPlugin = true;

const providers = JSON.parse(await readFile(new URL('./providers.json', import.meta.url)));

/**
 * @private
 * Get the oembed uri via known providers
 * @param {String} uri The page uri
 * @return {String} The oembed uri
 */
function lookupStaticProviders(uri) {
    var protocolMatch = uri.match(/^(https?:\/\/)/);
    if (!protocolMatch || /^https?:\/\/blog\./i.test(uri)) {
        return null;
    }
    var uri2 = uri.substr(protocolMatch[1].length);

    uri = uri.replace(/#.+$/, "");

    var links;

    for (var j = 0; j < providers.length; j++) {
        var p = providers[j];
        var match;
        for (var i = 0; i < p.templates.length; i++) {
            // Explicitly specify ^ - beggining of url. Protocol already removed in uri2.
            // Add (www.)? if some providers templates missing it.
            match = uri2.match((p.templates[i].startsWith("^") ? "" : "^(?:www.)?") + p.templates[i]);
            if (match) break;
        }

        if (match) {

            function replaceParts (str) {
                var s = str;
                var groups = str && str.match(/\{\d+\}/g);
                if (groups) {
                    groups.forEach(function(g) {
                        var n = parseInt(g.match(/\{(\d+)\}/)[1]);
                        s = s.replace("{" + n + "}", match[n]);
                    })
                }
                return s;
            }

            var canonical = replaceParts(p.url);
            var endpoint = p.endpoint;

            if (/\{\d+\}/i.test(endpoint)) {
                endpoint = replaceParts(endpoint);

            } else if (endpoint.match(/\{url\}/)) {
                endpoint = endpoint.replace(/\{url\}/, encodeURIComponent(canonical || uri));

            } else {
                endpoint = endpoint + '?url=' + encodeURIComponent(canonical || uri);
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

export function findOembedLinks(uri, meta) {
    // Filter oembed from meta.

    // allow misspelled discovery links
    if (meta && meta.alternative && !meta.alternate) {
        meta.alternate = meta.alternative;
        delete meta.alternative;
    }

    var alternate = meta && meta.alternate;
    if (alternate && !(alternate instanceof Array)) {
        alternate = [alternate];
        meta.alternate = alternate;
    }

    var oembedLinks = meta && meta.alternate && meta.alternate.filter(function(link) {
        return /^(application|text)\/(xml|json)\+oembed$/i.test(link.type);
    });

    if (uri && (!oembedLinks || !oembedLinks.length)) {
        // Find oembed in static providers list.
        oembedLinks = lookupStaticProviders(uri);

        if (meta && oembedLinks) {
            // Merge found links to meta.
            meta.alternate = (meta.alternate || []).concat(oembedLinks);
        }
    }

    if (oembedLinks && oembedLinks.length === 0) {
        oembedLinks = null;
    }

    return oembedLinks;
};

/**
 * @private
 * Fetches and parses oEmbed by oEmbed URL got from discovery.
 * @param {String} uri Full oEmbed endpoint plus URL and any needed format parameter.
 * @param {Function} callback Completion callback function. The callback gets two arguments (error, oembed) where oembed is json parsed oEmbed object.
 * */
 export function getOembed(uri, options, callback) {

    if (typeof options === 'function') {
        callback = options;
        options = null;
    }

    var ADD_OEMBED_PARAMS = [];
    if (options && Array.isArray(options.ADD_OEMBED_PARAMS)) {
        ADD_OEMBED_PARAMS = ADD_OEMBED_PARAMS.concat(options.ADD_OEMBED_PARAMS);
    }
    if (CONFIG.ADD_OEMBED_PARAMS) {
        ADD_OEMBED_PARAMS = ADD_OEMBED_PARAMS.concat(CONFIG.ADD_OEMBED_PARAMS);
    }

    try {
        var params = ADD_OEMBED_PARAMS.find(params => {
            return Array.isArray(params.re) && params.re.find(re => uri.match(re));
        });
        if (params) {
            var urlObj = urlLib.parse(uri, true, true);
            var query = urlObj.query;
            delete urlObj.search;

            Object.keys(params.params).forEach(function(key) {
                if (/^\$\{.+\}$/.test(params.params[key])) {
                    query[key] = options.getRequestOptions(params.params[key].replace(/^\${/, '').replace(/}$/, ''), '');
                } else {
                    query[key] = params.params[key];
                }
            });

            uri = urlLib.format(urlObj);
        }
    } catch(ex) {
        console.error("Error using ADD_OEMBED_PARAMS", ex);
    }

    var oembed_key = 'meta:' + uri;  

    async.waterfall([

        function(cb) {
            // Ignore proxy.cache_ttl, if options.cache_ttl === 0 - do not read from cache.
            if (options && (options.refresh || options.cache_ttl === 0)) {
                cb(null, null);
            } else {
                cache.get(oembed_key, cb);
            }
        },

        function(data, cb) {

            // Fallback to `request` format. Remove after 10.10.2020.
            var cachedError = (data && data.response && data.data && data.data.error) || (data && data.error);
            if (cachedError) {
                log('   -- Oembed cache error: ' + uri, JSON.stringify(data));
            }

            if (data && !cachedError) {
                if (data.response && data.data) {
                    // Fallback to `request` format. Remove after 10.10.2020.
                    data = data.data;
                }
                log('   -- Using cached oembed for: ' + uri);
                return cb({good_data_from_cache: true}, data);
            }

            // Reformat uri to escape not allowed get param characters.
            var urlObj = urlLib.parse(uri, true);
            delete urlObj.search;
            uri = urlLib.format(urlObj);

            var cbCalled = false;

            // Need check to prevent double error on timeout.
            var cbWrapper = function(error, data) {
                if (cbCalled) return;
                cbCalled = true;
                cb(error, data);
            };

            var parseResponse = function(res, statusCodeError) {
                stream2oembed(uri, res, function(error, oembed) {
                    if (error) {
                        if (statusCodeError) {
                            return cbWrapper(statusCodeError, {exception: error});
                        } else {
                            return cbWrapper(error);
                        }
                    }

                    var result = {};
                    for(var key in oembed) {
                        var goodKey = key.replace(/-/g, "_");
                        result[goodKey] = oembed[key];
                    }

                    cbWrapper(statusCodeError, result);
                });
            }

            getUrlFunctional(uri, {}, {
                onError: cbWrapper,
                onResponse: function(res) {
                    if (res.status == 200) {
                        parseResponse(res);
                    } else if (options && options.parseErrorBody) {
                        parseResponse(res, res.status);
                    } else {
                        cbWrapper(res.status);
                    }
                }
            });
        }

    ], function(error, data) {

        if (!error && data) {
            cache.set(oembed_key, data, {
                // Use proxy.cache_ttl or options.cache_ttl.
                // If options.cache_ttl === 0 and no proxy.cache_ttl, then CONFIG.CACHE_TTL will be used.
                ttl: utils.getMaxCacheTTL(uri, options)
            });
        }

        if (error && error.good_data_from_cache) {
            error = null;
        }

        callback(error, data);
    });
};

/**
 * @private
 * Convert XML or JSON stream to an oEmbed object.
 */
function stream2oembed(uri, stream, callback) {
    var contentType = stream.headers && stream.headers['content-type'];
    if (contentType && contentType.match('xml')) {

        xmlStream2oembed(stream, callback)

    } else if (contentType && contentType.match('json')) {

        jsonStream2oembed(stream, callback);

    } else {

        var oembed;

        async.some([jsonStream2oembed, xmlStream2oembed], function(processor, cb) {
            processor(stream, function(error, data) {
                if (!error && data && Object.keys(data).length > 0) { // keys check <= xmlStream2oembed creates empty {} json on opentag and returns it if any error
                    oembed = data;
                    cb(null, true);
                } else {
                    cb(null, false);
                }
            });
        }, function(error, result) {
            if (result) {
                callback(null, oembed);
            } else {
                callback('oembed content type not provided and not recognized for', uri);
            }
        });
    }
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

    // TODO: test
    // var SD = require('string_decoder').StringDecoder;
    // saxStream._decoder = new SD(charset);

    var finished = false;
    function finish(error, data) {
        // Tag can be closed twice for generic html.
        if (finished) return;
        finished = true;
        callback(error, data);
    }

    saxStream.on('error', function(err) {
        finish(err);
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
            finish(null, oembed);

        } else {
            if (prop) {

                if (charset !== 'UTF-8') {
                    // Decode only non UTF-8 because sax makes decoding.
                    var oldValue = value;
                    value = encodeText(charset, value);
                    log('      -- decode oembed xml (charset, in, out):', charset, oldValue, value);
                }

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
                data = utils.parseJSONSource(encodeText(charset, data));
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