var events = require('events');
var request = require('request');
var Http2Agent = require('./agent-http2').Http2Agent;
var zlib = require('zlib');
var decompressStream = require('iltorb').decompressStream;
var iconv = require('iconv-lite');
var async = require('async');
var imagesize = require('probe-image-size');
var _ = require('underscore');

var parseIsoDuration = require('parse-iso-duration');
var entities = require('entities');

var cache = require('./cache');
var htmlUtils = require('./html-utils');

var sysUtils = require('../logging');

var http2Agent = new Http2Agent(/* options */);

if (!global.CONFIG) {
    global.CONFIG = require('../config');
}

function prepareEncodedUri(request_options, attr) {
    var url = request_options[attr];
    if (url && !/%[A-Z0-9]/i.test(url)) {
        request_options[attr] = encodeURI(url);
    }
}

function fixTTL(ttl) {
    if (ttl === 0) {
        return ttl;
    }
    // 'null' converted to 0 - not good fo checking cache_ttl === 0.
    // 'undefined' is big NaN for math.max.
    // -1 is converted to null to not match cache_ttl === 0.
    return ttl || -1;
}

function maxTTL(ttl) {
    if (ttl === -1) {
        // Convert -1 to null, to not match cache_ttl === 0.
        return null;
    }
    return ttl;
}

var getMaxCacheTTL = exports.getMaxCacheTTL = function(url, options, default_min_ttl) {
    var result;
    if (CONFIG.PROXY || (options && options.proxy)) {

        var proxy = (options && options.proxy) || CONFIG.PROXY.find(p => {
            return p.re && p.re.some(re => url.match(re));
        });
        if (proxy) {
            if ('cache_ttl' in proxy) {
                result = Math.max(fixTTL(options && options.cache_ttl), fixTTL(proxy.cache_ttl), fixTTL(default_min_ttl));
                result = maxTTL(result);
                return result;
            }
        }
    }
    result = Math.max(fixTTL(options && options.cache_ttl), fixTTL(default_min_ttl));
    result = maxTTL(result);
    return result;
};

var prepareRequestOptions = exports.prepareRequestOptions = function(request_options, options) {

    var url = request_options.uri || request_options.url;

    var disableHttp2 = options && options.disableHttp2 || CONFIG.DISABLE_HTTP2;

    if (CONFIG.PROXY || (options && options.proxy)) {

        var proxy = (options && options.proxy) || CONFIG.PROXY.find(p => {
            return p.re && p.re.some(re => url.match(re));
        });
        if (proxy) {
            if (proxy.prerender && CONFIG.PRERENDER_URL) {
                delete request_options.uri;
                delete request_options.url;
                // `url` used above for agent check.
                url = CONFIG.PRERENDER_URL + encodeURIComponent(url);
                request_options.uri = url;
            }
            if (proxy.proxy_server) {
                request_options.proxy = proxy.proxy_server;
            }
            if (proxy.user_agent) {
                request_options.headers = request_options.headers || {};
                request_options.headers['User-Agent'] = proxy.user_agent;
            }
            if (proxy.headers) {
                request_options.headers = request_options.headers || {};
                _.extend(request_options.headers, proxy.headers)
            }
            if (proxy.request_options) {
                _.extend(request_options, proxy.request_options);
            }
            if (proxy.disable_http2) {
                disableHttp2 = true;
            }
        }
    }

    if (!disableHttp2
        && !request_options.proxy
        && /^https:/.test(url)
        && (!request_options.method
            || request_options.method === 'GET'
            || request_options.method === 'HEAD')) {
        // http2 only for ssl and without proxy.
        request_options.agent = http2Agent;
    }

    var lang = options && options.getProviderOptions && options.getProviderOptions('locale', 'en-US');
    if (lang) {
        request_options.headers = request_options.headers || {};
        request_options.headers['Accept-Language'] = lang.replace('_', '-') + CONFIG.ACCEPT_LANGUAGE_SUFFIX;
    }

    prepareEncodedUri(request_options, 'url');
    prepareEncodedUri(request_options, 'uri');

    return request_options;
};

var getUrlFunctional = exports.getUrlFunctional = function(url, options, callbacks) {

    getUrl(url, options)
        .on('error', function(error, opts) {

            // Retry on ECONNRESET. Http2Agent will try with `http1` after this error.
            if (!options.secondAttempt && (error.code in CONFIG.HTTP2_RETRY_CODES)) {
                sysUtils.log('   -- getUrl ' + error.code + ' first', opts, url);
                process.nextTick(function() {
                    getUrlFunctional(url, _.extend({}, options, {
                        secondAttempt: true, 
                        disableHttp2: true
                    }), callbacks);
                });
                return;
            } else if (options.secondAttempt && (error.code in CONFIG.HTTP2_RETRY_CODES)) {
                sysUtils.log('   -- getUrl ' + error.code + ' second', opts, url);
            }

            callbacks.onError && callbacks.onError(error);
        })
        .on('request', function(request) {
            callbacks.onRequest && callbacks.onRequest(request);
        })
        .on('response', function(response) {
            callbacks.onResponse && callbacks.onResponse(response);
        });
}

/**
 * @public
 * Do HTTP GET request and handle redirects
 * @param url Request uri (parsed object or string)
 * @param {Object} options
 * @param {Number} [options.maxRedirects]
 * @param {Boolean} [options.fullResponse] True if need load full page response. Default: false.
 * @param {Function} [callback] The completion callback function or events.EventEmitter object
 * @returns {events.EventEmitter} The emitter object which emit error or response event
 */
var getUrl = exports.getUrl = function(url, options) {

    var req = new events.EventEmitter();

    var options = options || {};

    // Store cookies between redirects and requests.
    var jar = options.jar;
    if (!jar) {
        jar = request.jar();
    }

    process.nextTick(function() {
        try {

            var sslProtocol = /^(https:)?\/\//i.test(url);

            var request_options = prepareRequestOptions({
                uri: url,
                method: 'GET',
                headers: {
                    'User-Agent': options.user_agent || CONFIG.USER_AGENT,
                    'Connection': 'keep-alive',                    
                    'Accept-Encoding': 'gzip' + (sslProtocol ? ', br' : ''),
                    'Accept': '*/*'
                },
                maxRedirects: options.maxRedirects || 3,
                timeout: options.timeout || CONFIG.RESPONSE_TIMEOUT,
                followRedirect: options.followRedirect,
                jar: jar
            }, options);

            var r = request(request_options)
                .on('error', function(error) {
                    req.emit('error', error, {http2Agent: request_options.agent === http2Agent});
                })
                .on('response', function(res) {

                    var contentEncoding = res.headers['content-encoding'];
                    contentEncoding = contentEncoding && contentEncoding.trim().toLowerCase();

                    var zlibOptions = {
                        flush: zlib.Z_SYNC_FLUSH,
                        finishFlush: zlib.Z_SYNC_FLUSH
                    };
                    
                    if (contentEncoding === 'br') {

                        var br = decompressStream();

                        br.request = res.request;
                        br.statusCode = res.statusCode;
                        br.headers = res.headers;

                        if (!options.asBuffer) {
                            br.setEncoding("binary");
                        }

                        req.emit('response', br);
                        res.pipe(br);

                    } else if (contentEncoding === 'gzip' || contentEncoding === 'deflate') {

                        var gunzip = contentEncoding === 'gzip' ? zlib.createGunzip(zlibOptions) : zlib.createInflate(zlibOptions);

                        gunzip.request = res.request;
                        gunzip.statusCode = res.statusCode;
                        gunzip.headers = res.headers;

                        if (!options.asBuffer) {
                            gunzip.setEncoding("binary");
                        }

                        req.emit('response', gunzip);
                        res.pipe(gunzip);

                    } else {

                        if (!options.asBuffer) {
                            res.setEncoding("binary");
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
};

var getHeadFunctional = exports.getHeadFunctional = function(url, options, callbacks) {

    getHead(url, options)
        .on('error', function(error) {

            // Retry on ECONNRESET.
            if (!options.secondAttempt && (error.code in CONFIG.HTTP2_RETRY_CODES)) {
                sysUtils.log('   -- getHead ' + error.code + ' first', url);
                process.nextTick(function() {
                    getHeadFunctional(url, _.extend({}, options, {secondAttempt: true}), callbacks);
                });
                return;
            } else if (options.secondAttempt && (error.code in CONFIG.HTTP2_RETRY_CODES)) {
                sysUtils.log('   -- getHead ' + error.code + ' second', url);
            }

            callbacks.onError && callbacks.onError(error);
        })
        .on('request', function(request) {
            callbacks.onRequest && callbacks.onRequest(request);
        })
        .on('response', function(response) {
            callbacks.onResponse && callbacks.onResponse(response);
        });
}

var getHead = function(url, options) {

    var req = new events.EventEmitter();

    var options = options || {};

    // Store cookies between redirects and requests.
    var jar = options.jar;
    if (!jar) {
        jar = request.jar();
    }

    process.nextTick(function() {
        try {
            var r = request(prepareRequestOptions({
                uri: url,
                method: 'HEAD',
                headers: {
                    'User-Agent': CONFIG.USER_AGENT,
                    'Connection': 'close'
                },
                maxRedirects: options.maxRedirects || 3,
                timeout: options.timeout || CONFIG.RESPONSE_TIMEOUT,
                followRedirect: options.followRedirect,
                jar: jar,
                agentOptions: {
                    // getHead called for video, need check certificate.
                    rejectUnauthorized: true
                }
            }, {
                disableHttp2: options && options.disableHttp2
            }))
                .on('error', function(error) {
                    req.emit('error', error);
                })
                .on('response', function(res) {
                    req.emit('response', res);
                });

            req.emit('request', r);

        } catch (ex) {
            console.error('Error on getHead for', url, '.\n Error:' + ex);
            req.emit('error', ex);
        }
    });
    return req;
};

exports.getCharset = function(string, doNotParse) {
    var charset;

    if (doNotParse) {
        charset = string.toUpperCase();
    } else if (string) {
        var m = string && string.match(/charset\s*=\s*([\w_-]+)/i);
        charset = m && m[1].toUpperCase();
    }

    return charset;
};

exports.encodeText = function(charset, text) { 
    try {
        var charset = charset || 'UTF-8';

        if (/* v > 0.9 */ Buffer.isEncoding
            && Buffer.isEncoding(charset)) {
            var b = Buffer.from(text, 'binary');
            text = b.toString(charset);
        } else {
            var b = iconv.encode(text, "ISO8859-1");
            text = iconv.decode(b, charset);
            
        }

        // Remove 'REPLACEMENT CHARACTER'.
        text = text.replace(/\uFFFD$/ig, '');

        // Trim. Available only after decode.
        text = text.replace(/^\s+|\s+$/g, '');

        return text;
    } catch(e) {
        return text;
    }
};

exports.parseJSONSource = function(text, decode) {

    try {
        return JSON.parse(decode ? entities.decodeHTML(decode(text)) : entities.decodeHTML(text));
    } catch (ex) {
        // default parser failed. Let's try to forgive
    }

    var s = text;
            
    // replace multi-line comments
    s = s.replace(/\/\*[^'":{}]+?\*\//g, '');
    // and single-line comments at the end
    s = s.replace(/(?<!https?:)\/\/[^'":{}]+$/gm, ''); 
    // and single-line comments on the new line
    s = s.replace(/^(?:[\s\n\r\t]+)?\/\/.+$/gm, '');

    // this is nuts. replace \' with '. 
    // Ex: https://uncrate.com/mclaren-720s-ride-on-childrens-car/
    // Ex: https://perezhilton.com/bachelorette-hannah-brown-sex-windmill-controversy/
    s = s.replace(/\\"[^"]+\\"/g, function (match) {
        return match.replace(/\\'/g, "'");
    });
    s = s.replace(/"[^"]+"/g, function (match) {
        return match.replace(/\\'/g, "'");
    });

    // escape apostrophies as in dont't-> don\'t (assumably escapes it properly)
    s = s.replace(/"([^"]+)([^\\])'([^"]+)"/g, "\"$1$2\'$3\"");
    
    // replace 'values' with "values" at the end of the lines
    s = s.replace(/:(?:[\s\n\r\t]+)?'([^\']+)\'(?:[\s\n\r\t]+)?([\]}])/g, ':"$1"$2');
    s = s.replace(/:(?:[\s\t]+)?'([^\']+)\'(?:[\s\t]+)?(,)?(?:[\s\t]+)?$/gm, function (match, p1, p2) {        
        return ':"' + p1 + '"' + (p2 ? ',' : '');
    });

    // replace '' with "" for empty values
    s = s.replace(/:(?:[\s\n\r\t]+)?''(?:[\s\n\r\t]+)?([\]},])/g, ':""$1');
    
    // take ids into quotes "" for string values 
    s = s.replace(/(,|{)(?:[\s\n\r\t]+)?(\w+)?:(?:[\s\n\r\t]+)?\"/g, '$1"$2":"');

    // semicolon or coma at the end
    s = s.replace(/}(?:[\s\n\r\t]+)?[;,](?:[\s\n\r\t]+)?$/g, '}');
    // or coma in between
    s = s.replace(/,(?:[\s\n\r\t]+)?(\}|\])(?:[\s\n\r\t]+)?([,\]}])/g, '$1$2');


    // decode all string values    
    s = s.replace(/:(?:[\s\n\r\t]+)?\"([^"]+[^\\])\"/g, function (match, p1) {
        var str = decode ? entities.decodeHTML(decode(p1)) : entities.decodeHTML(p1);
        str = str.replace(/([^\\])"/g, '$1\\"');
        str = str.replace(/^"/, '\\"');

        return ':"' + str + '"';
    });

    // and avoid line breaks in text values
    s = s.replace(/[\n\r\t]+/g, '');

    // : undefined -> 0
    s = s.replace(/:(?:[\s\n\r\t]+)?undefined/g, ': 0');

    // also, for some reason, many cases with an extra } at the end
    var a = (s.match(/{/g) || []).length;
    var b = (s.match(/}/g) || []).length;
    if (b == a +1) {s = s.replace(/}(?:\s+)?$/, '');}

    return JSON.parse(s);
};

/**
 * @public
 * Get image size and type.
 * @param {String} uri Image uri.
 * @param {Object} [options] Options.
 * @param {Boolean} [options.cache] False to disable cache. Default: true.
 * @param {Function} callback Completion callback function. The callback gets two arguments (error, result) where result has:
 *  - result.format
 *  - result.width
 *  - result.height
 *
 *  error == 404 if not found.
 * */
exports.getImageMetadata = function(uri, options, callback){

    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    options = options || {};

    cache.withCache("image-meta:" + uri, function(callback) {

        var loadImageHead, imageResponseStarted, totalTime, timeout, contentLength;
        var requestInstance = null;

        function finish(error, data) {

            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            } else {
                return;
            }

            // We don't need more data. Abort causes error. timeout === null here so error will be skipped.
            abortRequest(requestInstance)

            if (!error && !data) {
                error = 404;
            }

            data = data || {};

            if (options.debug) {
                data._time = {
                    imageResponseStarted: imageResponseStarted || totalTime(),
                    loadImageHead: loadImageHead && loadImageHead() || 0,
                    total: totalTime()
                };
            }

            if (error && error.message) {
                error = error.message;
            }

            if ((typeof error === 'string' && error.indexOf('ENOTFOUND') > -1) ||
                error === 500) {
                error = 404;
            }

            if (error) {
                data.error = error;
            }

            callback(null, data);
        }

        timeout = setTimeout(function() {
            finish("timeout");
        }, options.timeout || CONFIG.RESPONSE_TIMEOUT);

        if (options.debug) {
            totalTime = createTimer();
        }

        async.waterfall([
            function(cb) {

                var imagesizeDone, firstError, firstData, firstSource;

                function finishCb(error, data, source) {

                    // imagesize may call callback twice for http2.
                    if (imagesizeDone) {
                        console.error('  -- Double callback call on getImageMetadata for', {
                            uri: uri, 
                            error: error, 
                            data: data,
                            source: source,
                            firstError: firstError, 
                            firstData: firstData,
                            firstSource: firstSource
                        });
                        return;
                    } else {
                        firstError = error;
                        firstData = data;
                        firstSource = source;
                    }
                    imagesizeDone = true;
                    cb(error, data);
                }

                getUrlFunctional(uri, {
                    timeout: options.timeout || CONFIG.RESPONSE_TIMEOUT,
                    maxRedirects: 5,
                    asBuffer: true,
                    disableHttp2: options && options.disableHttp2
                }, {
                    onRequest: function(req) {
                        requestInstance = req;
                    },
                    onResponse: function(res) {

                        var content_type = res.headers['content-type'];

                        if (content_type && content_type !== 'application/octet-stream' && content_type !== 'binary/octet-stream') {

                            if (content_type.indexOf('image') === -1 && !uri.match(/\.(jpg|png|gif|webp)(\?.*)?$/i)) {
                                return finishCb('invalid content type: ' + res.headers['content-type'], undefined, 'onResponse content_type');
                            }
                        }

                        if (res.statusCode == 200) {
                            if (options.debug) {
                                imageResponseStarted = totalTime();
                            }
                            contentLength = parseInt(res.headers['content-length'] || '0', 10);
                            imagesize(res, function(error, data) {
                                if (data && data.type) {
                                    data.format = data.type;
                                }
                                finishCb(error, data, 'imagesize');
                            });
                        } else {
                            finishCb(res.statusCode, undefined, 'onResponse !200');
                        }
                    },
                    onError: function(error) {
                        // TODO: One time I had here Error: Callback was already called.
                        finishCb(error, undefined, 'onError');
                    }
                });
            },
            function(data, cb){

                if (options.debug) {
                    loadImageHead = createTimer();
                }

                if (contentLength) {
                    data.content_length = contentLength;
                }

                cb(null, data);
            }
        ], finish);

    }, {
        // Ignore proxy.cache_ttl, if options.cache_ttl === 0 - do not read from cache.
        refresh: options.refresh || options.cache_ttl === 0,
        doNotWaitFunctionIfNoCache: options.doNotWaitFunctionIfNoCache,
        ttl: getMaxCacheTTL(uri, options, CONFIG.IMAGE_META_CACHE_TTL),
        multiCache: options.multiCache
    }, callback);
};

exports.getUriStatus = function(uri, options, callback) {

    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    options = options || {};

    cache.withCache("status:" + uri, function(cb) {

        var time, timeout;

        function finish(error, data) {

            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            } else {
                return;
            }

            data = data || {};

            if (error) {
                data.error = error;
            }

            if (options.debug) {
                data._time = time();
            }

            cb(null, data);
        }

        timeout = setTimeout(function() {
            finish("timeout");
        }, options.timeout || CONFIG.RESPONSE_TIMEOUT);

        if (options.debug) {
            time = createTimer();
        }

        getUriStatus(uri, options, finish);

    }, {
        // Ignore proxy.cache_ttl, if options.cache_ttl === 0 - do not read from cache.
        refresh: options.refresh || options.cache_ttl === 0,
        doNotWaitFunctionIfNoCache: options.doNotWaitFunctionIfNoCache,
        ttl: getMaxCacheTTL(uri, options, CONFIG.IMAGE_META_CACHE_TTL),
        multiCache: options.multiCache
    }, callback);
};

exports.getContentType = function(uriForCache, uriOriginal, options, cb) {

    cache.withCache("content-type:" + uriForCache, function(cb) {

        var timeout, requestInstance, totalTime;

        function finish(error, headers) {

            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            } else {
                return;
            }

            // We don't need more data. Abort causes error. timeout === null here so error will be skipped.
            abortRequest(requestInstance);

            var data = {};

            if (options.debug) {
                data._time = totalTime();
            }

            if (error) {
                data.error = error;
            }

            if (data.error && data.error.message) {
                // Compact error if 'reason' available.
                data.error = data.error.message;
            }

            if (!error && !headers) {
                data.error = 408;
            }

            if (headers) {
                data.type = headers['content-type'];
                if (data.type) {
                    data.type = data.type.split(';')[0]; // may have charset after ;
                }

                // no need to keep all other headers in cache. List what's needed.
                if (headers['x-frame-options']) data.x_frame_options = headers['x-frame-options'];
                if (headers['content-security-policy']) data.csp = headers['content-security-policy'];
                if (headers['access-control-allow-origin']) data.allow_origin = headers['access-control-allow-origin'];
                if (headers['accept-ranges']) data.accept_ranges = headers['accept-ranges'];
                if (headers['location'] !== uriOriginal) data.href = headers['location'];  
            }

            cb(null, data);
        }

        timeout = setTimeout(function() {
            finish("timeout");
        }, options.timeout || CONFIG.RESPONSE_TIMEOUT);

        if (options.debug) {
            totalTime = createTimer();
        }

        function makeCall(method) {

            var methodCaller = method && method === 'GET' ? getUrlFunctional : getHeadFunctional;

            methodCaller(uriOriginal, {
                timeout: options.timeout || CONFIG.RESPONSE_TIMEOUT,
                maxRedirects: 5,
                disableHttp2: options && options.disableHttp2
            }, {
                onRequest: function(req) {
                    requestInstance = req;                    
                },
                onResponse: function(res) {
                    var error = res.statusCode && res.statusCode != 200 ? res.statusCode : null;

                    if (!method
                        // If method HEAD is not allowed. ex. Amazon S3 (=403)
                        // Try call with GET.
                        && (error === 405 
                            || error === 403 
                            || error === 400 
                            || error >= 500
                            // Or ClourFront that gobbles up headers when checking CORS.
                            || (res.headers && !res.headers['access-control-allow-origin']
                                && res.headers.server === 'AmazonS3' && !error ))) {
                        makeCall('GET');
                        return;
                    }

                    if (res.request && res.request.href && res.headers && res.request.href !== uriOriginal) {
                        res.headers.location = res.request.href;
                    }

                    finish(error, res.headers);
                },
                onError: function(error) {
                    finish(error);
                }
            });
        }

        // Call HEAD.
        makeCall();

    }, {
        // Ignore proxy.cache_ttl, if options.cache_ttl === 0 - do not read from cache.
        refresh: options.refresh || options.cache_ttl === 0,
        ttl: getMaxCacheTTL(uriOriginal, options, CONFIG.CACHE_TTL),
    }, cb);
};

exports.unifyDuration = function(duration) {
    if (duration && typeof duration === 'string') {

        if (duration.match(/^\d+$/)) {
            return parseInt(duration);
        }

        try {
            var ms = parseIsoDuration(duration);
        } catch(ex) {
            return null;
        }

        return Math.round(ms / 1000);
    } else {
        return duration;
    }
};

var NOW = new Date().getTime();

var minDate = new Date(1990, 1);

exports.unifyDate = function(date) {

    if (_.isArray(date)) {
        date = date[0];
    }

    if (typeof date === "string" && date.match(/^\d+$/)) {
        date = parseInt(date);
    }

    if (typeof date === "number") {

        if (date === 0) {
            return null;
        }

        // Check if date in seconds, not miliseconds.
        if (NOW / date > 100) {
            date = date * 1000;
        }

        date = new Date(date);

        if (date < minDate) {
            return null;
        }

        return date.toISOString().replace(/T.+$/, ''); // Remove time (no timezone).
    }

    // TODO: time in format 'Mon, 29 October 2012 18:15:00' parsed as local timezone anyway.
    var timestamp = Date.parse(date);

    if (isNaN(timestamp) && date.replace) {
        // allow Z at the end which Node doesn't seem to parse into timestamp otherwise
        // also allow Oct 15th, 2014
        timestamp = Date.parse(date.replace(/Z$/, '').replace(/(\d)(?:th|nd|rd),\s(\d+)$/i, "$1, $2"));
    }

    if (!isNaN(timestamp) && timestamp > 0) {  // check timestamp > 0 to skip likely broken dates like "0001-01-01T00:00:00Z
        var dateStr = new Date(timestamp).toISOString();

        // Remove time if no timezone specified.
        if (!date.match(/Z$/i)                                      // ISO date with Z at and.
            && !date.match(/ \w+$/i)                                // GMT, UTC, ...
            && !date.match(/\d\d:\d\d.*[\+\-]\d\d(:?\d\d)?$/i)) {   // ISO 8601: +1000 -10 (YYYY-MM-DDThh:mm:ss[.sss]±hh:mm)

            dateStr = dateStr.replace(/T.+$/, '')
        }

        return dateStr;
    }

    // Bad date to parse.
    return null;
};


var lowerCaseKeys = exports.lowerCaseKeys = function(obj) {
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
};

exports.sendLogToWhitelist = function(uri, meta, oembed, oembedLinks, whitelistRecord) {

    if (!CONFIG.WHITELIST_LOG_URL) {
        return;
    }

    if (uri.match(/^(https?:)?\/\/[^\/]+\/?$/i)) {
        // Skip base domain url.
        return;
    }

    var oembedHref = oembedLinks && oembedLinks.length && oembedLinks[0].href;

    if (oembedHref && oembedHref.match(/\/wp-json\/oembed\//)) {
        return;
    }

    var data = getWhitelistLogData(meta, oembed);

    if (data) {

        if (whitelistRecord && !whitelistRecord.isDefault) {
            // Check if all detected rels present in whitelist record.
            var hasNew = false;
            for(var key in data) {
                var bits = key.split('_');
                var source = bits[0];
                var rel = bits[1];
                // Skip existing source-rel.
                if (!whitelistRecord[source] || !whitelistRecord[source][rel]) {
                    hasNew = true
                }
            }
            if (!hasNew) {
                return hasNew;
            }
        }

        data.uri = uri;

        if (oembedHref) {
            data.oembed = oembedHref;
        }

        request({
            uri: CONFIG.WHITELIST_LOG_URL,
            method: 'GET',
            qs: data
        })
            .on('error', function(error) {
                console.error('Error logging url:', uri, error);
            })
            .on('response', function(res) {
                if (res.statusCode !== 200) {
                    console.error('Error logging url:', uri, res.statusCode);
                }
            });
    }
};

exports.filterLinks = function(data, options) {

    var links = data.links;

    for(var i = 0; i < links.length;) {

        var link = links[i];

        // SSL.

        var isImage = link.type.indexOf('image') === 0;
        var isHTML5Video = link.type.indexOf('video/') === 0;

        if (options.filterNonSSL) {

            var sslProtocol = link.href && link.href.match(/^(https:)?\/\//i);
            var hasSSL = link.rel.indexOf('ssl') > -1;

            if (sslProtocol || hasSSL || isImage || isHTML5Video) {
                // Good: has ssl.
            } else {
                // Filter non ssl if required.
                link.error = true;
            }
        }

        // HTML5.

        if (options.filterNonHTML5) {
            var hasHTML5 = link.rel.indexOf('html5') > -1;
            var isReader = link.rel.indexOf('reader') > -1;

            if (hasHTML5 || isImage || isHTML5Video || isReader) {
                // Good: is HTML5.
            } else {
                // Filter non HTML5 if required.
                link.error = true;
            }
        }

        // Max-width.

        if (options.maxWidth) {

            var isImage = link.type.indexOf('image') === 0;
            // TODO: force make html5 video responsive?
            var isHTML5Video = link.type.indexOf('video/') === 0;

            var m = link.media;

            if (m && !isImage && !isHTML5Video) {
                if (m.width && m.width > options.maxWidth) {
                    link.error = true;
                } else if (m['min-width'] && m['min-width'] > options.maxWidth) {
                    link.error = true;
                }
            }
        }

        if (link.error) {
            links.splice(i, 1);
        } else {
            i++;
        }
    }
};

function iterateLinks(links, func) {

    if (links instanceof Array) {

        return links.forEach(func);

    } else if (typeof links === 'object') {

        for(var id in links) {
            var items = links[id];
            if (items instanceof Array) {
                items.forEach(func);
            }
        }
    }
}

exports.generateLinksHtml = function(data, options) {

    // Links may be grouped.

    var links = data.links;

    options.iframelyData = data;

    if (CONFIG.GENERATE_LINK_PARAMS) {
        _.extend(options, CONFIG.GENERATE_LINK_PARAMS);
    }

    iterateLinks(links, function(link) {
        if (!link.html && !link.type.match(/^image/)) {

            // Force make mp4 video to be autoplay in autoplayMode.
            if (options.autoplayMode && link.type.indexOf('video/') === 0 && link.rel.indexOf('autoplay') === -1) {
                link.rel.push('autoplay');
            }

            var html = htmlUtils.generateLinkElementHtml(link, options);

            if (html) {
                link.html = html;
            }
        }
    });

    if (!data.html) {

        var links_list = [];
        iterateLinks(links, function(link) {
            links_list.push(link);
        });
        var plain_data = _.extend({}, data, {links:links_list});

        // Prevent override main html field.
        var mainLink = htmlUtils.findMainLink(plain_data, options);

        if (mainLink) {

            var html = mainLink.html;

            if (!html && mainLink.type.match(/^image/)) {

                html = htmlUtils.generateLinkElementHtml(mainLink, options);
            }

            if (html) {
                data.rel = mainLink.rel;
                data.html = html;

                if (mainLink.options) {
                    data.options = mainLink.options;
                }
            }
        }
    }

    data.rel = data.rel || [];
};


//====================================================================================
// Private
//====================================================================================

var getUriStatus = function(uri, options, cb) {

    try {
        var r = request(prepareRequestOptions({
            uri: uri,
            method: 'GET',
            headers: {
                'User-Agent': CONFIG.USER_AGENT
            },
            maxRedirects: 5,
            timeout: options.timeout || CONFIG.RESPONSE_TIMEOUT,
            jar: request.jar()   //Enable cookies, uses new jar
        }, {
            disableHttp2: options.disableHttp2
        }))
            .on('error', cb)
            .on('response', function(res) {
                abortRequest(r);
                var data = {
                    code: res.statusCode,
                    content_type: res.headers && res.headers['content-type'],
                    content_length: res.headers && res.headers['content-length'] ? parseInt(res.headers['content-length'] || '0', 10) : null
                };
                if (options.checkHeaders) {
                    data.headers = res.headers;
                }
                cb(null, data);
            });

    } catch (ex) {
        cb(ex.message);
    }
};

var createTimer = exports.createTimer = function() {

    var timer = new Date().getTime();

    return function() {
        return new Date().getTime() - timer;
    };
};

var SHOPIFY_OEMBED_URLS = ['shopify.com', '/collections/', '/products/'];

function isMp4(data) {
    var url = data && (data.url || data);
    if (url && url.match) {
        return !!url.match(/\.mp4(\?.*)?$/);
    }
}

function isYoutube(meta) {

    var video;
    if (meta.og && (video = meta.og.video)) {
        if (!(video instanceof Array)) {
            video = [video];
        }
        for(var i = 0; i < video.length; i++) {
            var v = video[i];

            var url = v.url || v;

            if (url.indexOf && url.indexOf('youtube') > -1) {
                return true;
            }

            if (v.secure_url && v.secure_url.indexOf && v.secure_url.indexOf('youtube') > -1) {
                return true;
            }
        }
    }

    return false;
}

function getWhitelistLogData(meta, oembed) {

    var r = {};

    if (meta) {
        var isJetpack = meta.twitter && meta.twitter.card === 'jetpack';
        var isWordpress = meta.generator && /wordpress/i.test(meta.generator);
        var isSPIP = meta.generator && /^SPIP/i.test(meta.generator);

        var isShopify = false;
        if (meta.alternate) {
            var alternate = meta.alternate instanceof Array ? meta.alternate : [meta.alternate];
            var oembedLink;
            for(var i = 0; !oembedLink && i < alternate.length; i++) {
                var a = alternate[i];
                if (a && a.type && a.href && a.type.indexOf('oembed') > -1) {
                    oembedLink = a;
                }
            }
            if (oembedLink) {
                for(var i = 0; !isShopify && i < SHOPIFY_OEMBED_URLS.length; i++) {
                    if (oembedLink.href.indexOf(SHOPIFY_OEMBED_URLS[i]) > -1) {
                        isShopify = true;
                    }
                }
            }
        }

        r.twitter_photo =
            (meta.twitter && meta.twitter.card === 'photo')
            &&
            (meta.og && meta.og.type !== "article")
            &&
            !isJetpack
            &&
            !isWordpress
            &&
            (meta.twitter && meta.twitter.site !== 'tumblr')
            && (
                (meta.twitter && !!meta.twitter.image)
                ||
                (meta.og && !!meta.og.image)
            );

        r.twitter_player =
            meta.twitter && !!meta.twitter.player;

        r.twitter_stream =
            meta.twitter && meta.twitter.player && !!meta.twitter.player.stream;

        r.og_video =
            (meta.og && !!meta.og.video)
            && !isYoutube(meta)
            && !isMp4(meta.og.video);

        r.video_src =
            !!meta.video_src;

        if (meta.ld && meta.ld.videoobject) {
            r.embedURL = !!(meta.ld.videoobject.embedURL || meta.ld.videoobject.embedUrl || meta.ld.videoobject.embedurl);
        }

    }

    if (oembed && oembed.type && oembed.type !== 'link' && !(isWordpress || isSPIP)) {
        r['oembed_' + oembed.type] = true;
    }

    var hasTrue = false;
    var result = {};
    for(var k in r) {
        if (r[k]) {
            result[k] = r[k];
            hasTrue = true;
        }
    }

    return hasTrue && result;
}

exports.getIframelyErrorShortCode = function(error) {

    if (error.responseCode) {
        // 'http error'
        return error.responseCode;
    }

    if (error.error && error.error.code) {
        // 'request error'
        return error.error.code
    }

    return error.code;
};

var abortRequest = exports.abortRequest = function(request) {
    if (request && request.response && request.response.h2) {
        // Abort http2 with special method.
        request.response.abort();
    } else if (request && !request.aborted) {
        request.abort();
    }
};

/**
 * @public
 * Generate slug for provider based on domain name of URL provided
 * @param url Request uri string
 */
exports.getProviderName = function(url) {

    try {
        var domain = url.match(/^https?:\/\/([^\/\?#]+)/)[1];
        var provider = domain.match(/([^\.\/\?]+)\.(?:com?\.)?[a-z]+$/)[1];
        return provider.replace(/\./g, '-');
    } catch(ex) {
        return undefined;
    }


};
