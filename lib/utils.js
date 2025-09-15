import * as events from 'events';
import { fetchStream, fetchStreamKeepAlive, fetchStreamAuthorized, extendCookiesJar, setCookieFromJar } from './fetch.js';
import iconv from 'iconv-lite';
import * as async from 'async';
import imagesize from 'probe-image-size';
import * as parseIsoDuration from 'parse-iso-duration';
import * as entities from 'entities';
import { cache } from './cache.js';
import * as htmlUtils from './html-utils.js';
import log from '../logging.js';
import { resolve } from 'url';
import JSON5 from 'json5';

import CONFIG from '../config.loader.js';

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

function getCustomProxyForUri(uri, options) {
    var proxy = CONFIG.PROXY && CONFIG.PROXY.find(p => {
        return p && p.re && p.re.some(item => {
            if (typeof item === 'string') {
                // Plugin id.
                if (CONFIG._plugins && item in CONFIG._plugins) {
                    return CONFIG._plugins[item].re.some(re => uri.match(re));
                } else if (!options || !options.skipPlugins) {
                    console.warn('Invalid PROXY plugin id "' + item + '"');
                }
            } else {
                // Regexp.
                return uri.match(item);
            }
        });
    });
    return proxy;
}

export function getMaxCacheTTLOverride(url, options) {
    var proxy = null;
    if (CONFIG.PROXY || (options && options.proxy)) {
        proxy = (options && options.proxy) || getCustomProxyForUri(url);
    }
    return proxy;
};

export function getMaxCacheTTL(url, options, default_min_ttl) {
    var proxy = getMaxCacheTTLOverride(url, options);
    var result = Math.max(fixTTL(options && options.cache_ttl), fixTTL(proxy && proxy.cache_ttl), fixTTL(default_min_ttl));
    result = maxTTL(result);

    // Use `proxy.max_cache_ttl` if needed.
    // Also used for images ttl.
    if (proxy 
        && proxy.max_cache_ttl 
        && (!result || result > proxy.max_cache_ttl)) {
        result = proxy.max_cache_ttl;
    }

    return result;
};

export function prepareRequestOptions(request_options, options) {

    if (request_options.url && !request_options.uri) {
        request_options.uri = request_options.url;
    }
    var uri = request_options.uri;
    delete request_options.url;

    var disable_language = false;

    if (CONFIG.PROXY || (options && options.proxy)) {

        var proxy = (options && options.proxy) || getCustomProxyForUri(uri, options);
        if (proxy) {
            if (proxy.prerender && CONFIG.PRERENDER_URL) {
                request_options.uri = CONFIG.PRERENDER_URL + encodeURIComponent(uri);

            } else if (proxy.proxy && CONFIG.PROXY_URL) {
                request_options.uri = /{url}/.test(CONFIG.PROXY_URL) 
                    ? CONFIG.PROXY_URL.replace(/{url}/, encodeURIComponent(uri))
                    : CONFIG.PROXY_URL + encodeURIComponent(uri);
            } else if (proxy.proxy_url && /{url}/.test(proxy.proxy_url)) {
                request_options.uri = proxy.proxy_url.replace(/{url}/, encodeURIComponent(uri));
            }
            if (proxy.user_agent) {
                request_options.headers = request_options.headers || {};
                request_options.headers['User-Agent'] = proxy.user_agent;
            }
            if (proxy.headers) {
                request_options.headers = request_options.headers || {};
                Object.assign(request_options.headers, proxy.headers)
            }
            if (proxy.request_options) {
                Object.assign(request_options, proxy.request_options);
            }
            if (proxy.disable_http2) {
                request_options.disable_http2 = true;
            }
            if (proxy.disable_language) {
                disable_language = true;
            }
            if (options && proxy.maxredirects && (!options.redirectsHistory || options.redirectsHistory.length === 0)) {
                options.maxRedirects = proxy.maxredirects;
            }
            if (proxy && proxy.timeout > 0) {
                request_options.timeout = proxy.timeout > 100 ? proxy.timeout : proxy.timeout * 1000;
            }
        }
    }

    if (options && options.getProviderOptions 
        && (options.getProviderOptions('app.name') || options.getProviderOptions('app.ua_extension'))
        && request_options.headers
        && request_options.headers['User-Agent'] === CONFIG.USER_AGENT) {

        var ext = options.getProviderOptions('app.ua_extension', options.getProviderOptions('app.name'));
        if ( /^[a-zA-Z0-9\.\s_-]+$/.test(ext) && ext.length > 1) {
            ext =  ext[0].toUpperCase() + ext.slice(1)
            request_options.headers['User-Agent'] += ' ' + ext;
        }        
    } 

    var lang = options?.getProviderOptions && options.getProviderOptions('locale') || '';
    if (!disable_language) {
        request_options.headers = request_options.headers || {};
        request_options.headers['Accept-Language'] = 
            lang /* !== '' */
                ? lang.replace('_', '-') 
                    + (/\-/.test(lang) ? `,${lang.replace(/\-.*$/, '')};q=0.9` : '')
                    + ',en;q=0.7,*;q=0.5'
                : 'en,*';
    }

    prepareEncodedUri(request_options, 'uri');

    setCookieFromJar(request_options.headers, options?.jar)

    return request_options;
};

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
 export function getUrl(url, options, callbacks) {

    var options = options || {};

    var redirect, follow;
    if (options.followRedirect) {
        redirect = 'follow';
        follow = options.maxRedirects || CONFIG.MAX_REDIRECTS;
    }
    if (options.followRedirect === false) {
        redirect = 'manual';
        follow = 0;
    }

    // Custom redirect logit for cookies.
    if (options.followRedirect && options.reuseCookies) {
        redirect = 'manual';
        follow = 0;
    }

    var request_options = prepareRequestOptions({
        // Reviewed.
        uri: url,
        method: 'GET',
        headers: {
            'User-Agent': options.user_agent || CONFIG.USER_AGENT,
            'Accept': '*/*'
        },
        timeout: options.timeout || CONFIG.RESPONSE_TIMEOUT,
        redirect: redirect,
        follow: follow
    }, options);

    try {
        fetchStreamKeepAlive(request_options)
            .then(stream => {

                // Custom inner redirect logic with cookies.
                if (options.followRedirect 
                    && options.reuseCookies 
                    && stream.status >= 300 
                    && stream.status < 400 
                    && stream.headers.location) {

                    if (options.maxRedirects <= 0) {
                        throw new Error('too_many_redirects'); // It's checked in HTML parser
                    }

                    const redirect_options = {...options};

                    redirect_options.maxRedirects = (options.maxRedirects || CONFIG.MAX_REDIRECTS) - 1;

                    const redirectUrl = resolve(url, stream.headers.location);

                    redirect_options.jar = extendCookiesJar(redirect_options.jar, stream.headers);                    

                    if (CONFIG.DEBUG) {
                        log('   -- Following redirect from', url, 'to', redirectUrl);
                    }

                    return getUrl(redirectUrl, redirect_options, callbacks);
                }

                if (!options.asBuffer) {
                    stream.setEncoding("binary");
                }
                callbacks.onResponse && callbacks.onResponse(stream, request_options);
            })
            .catch(error => {
                callbacks.onError && callbacks.onError(error);
            });

    } catch (ex) {
        console.error('Error on getUrl for', url, '.\n Error:' + ex);
        callbacks.onError && callbacks.onError(ex);
    }
};

export const getUrlFunctional = getUrl;

var getHead = function(url, options, callbacks) {

    var options = options || {};

    var redirect, follow;
    if (options.followRedirect) {
        redirect = 'follow';
        follow = options.maxRedirects || CONFIG.MAX_REDIRECTS;
    }
    if (options.followRedirect === false) {
        redirect = 'manual';
        follow = 0;
    }
    
    var request_options = prepareRequestOptions({
        // jar: jar,

        // Reviewed.
        uri: url,
        method: 'HEAD',
        headers: {
            'User-Agent': CONFIG.USER_AGENT
        },
        timeout: options.timeout || CONFIG.RESPONSE_TIMEOUT,
        redirect: redirect,
        follow: follow
        // No abort controller for head.
    }, options);

    try {
        fetchStreamAuthorized(request_options)
            .then(response => {
                callbacks.onResponse && callbacks.onResponse(response, request_options);
            })
            .catch(error => {
                callbacks.onError && callbacks.onError(error);
            });

    } catch (ex) {
        console.error('Error on getHead for', url, '.\n Error:' + ex);
        callbacks.onError && callbacks.onError(ex);
    }
};

export const getHeadFunctional = getHead;

export function getCharset(string, doNotParse) {
    var charset;

    if (doNotParse) {
        charset = string.toUpperCase();
    } else if (string) {
        var m = string && string.match(/charset\s*=\s*([\w_-]+)/i);
        charset = m && m[1].toUpperCase();
    }

    return charset;
};

export function encodeText(charset, text) { 
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

export function parseJSONSource(text, decode) {

    try {
        return JSON.parse(decode ? entities.decodeHTML(decode(text)) : entities.decodeHTML(text));
    } catch (ex) {
        // default parser failed. Let's try to forgive
    }

    try {
        return JSON5.parse(decode ? entities.decodeHTML(decode(text)) : entities.decodeHTML(text));
    } catch (ex) {
        // parser failed. Let's try to forgive more
    }    

    var s = text;
    
    // replace opening ( and closing )
    s = s.replace(/^(?:[\s\n\r\t]+)?\(/, '');
    s = s.replace(/(?:[\s\n\r\t]+)?\)$/, ''); 

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
    s = s.replace(/(,|{)(?:[\s\n\r\t]+)?(\w+)(?:[\s\n\r\t]+)?:(?:[\s\n\r\t]+)?(\"|{)/g, '$1"$2":$3');

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

export function parseLDSource(ld, decode, uri) {    

    if (typeof ld === 'string') {
        try {
            ld = parseJSONSource(ld, decode);
        } catch (ex) {
            log('   -- Error parsing ld-json', uri, ex.message);
            return;
        }
    }

    if (!ld) return;    

    if (!(ld instanceof Array)) {
        if (!ld['@type'] && ld['@graph'] && Array.isArray(ld['@graph'])) {
            ld = ld['@graph'];
        } else {
            ld = [ld];
        }
    }

    var ldParsed;

    const addObject = function(obj) {

        const pushObj = function(id, obj) {
            if (id) {

                if (!ldParsed) {
                    ldParsed = {};
                }

                if (!ldParsed[id]) {
                    ldParsed[id] = obj;
                } else {
                    if (!Array.isArray(ldParsed[id])) {
                        ldParsed[id] = [ldParsed[id]];
                    }
                    ldParsed[id].push(obj);
                }
            }            
        }

        if (Array.isArray(obj['@type'])) {            
            for (var i = 0; i < obj['@type'].length; i++) {
                var type = obj['@type'][i];
                pushObj(type && type.toLowerCase && type.toLowerCase(), obj);
            }
        } else {
            var type = obj && obj['@type'];
            pushObj(type && type.toLowerCase && type.toLowerCase(), obj);
        }
    };

    for (var i = 0; i < ld.length; i++) {
        try {
            var str = ld[i];
            var obj = typeof str === 'string' ? parseJSONSource(str, decode) : str;

            if (Array.isArray(obj)) {
                for(var j = 0; j < obj.length; j++) {
                    addObject(obj[j]);
                }
            } else {
                addObject(obj);
            }
            
        } catch (ex) {
            log('   -- Error parsing ld-json', uri, ex.message);
        }
    }

    if (ldParsed) {
        return ldParsed;
    }
};

export function findMainLdObjectWithVideo(ld) {

    let json = ld.videoobject || ld.mediaobject;

    /*
    || (ld.newsarticle && (ld.newsarticle.video || ld.newsarticle.videoobject)) 
    || (ld.tvepisode && (ld.tvepisode.video || ld.tvepisode.videoobject))
    || (ld.movie && (ld.movie.video || ld.movie.videoobject))
    || (ld.tvclip && (ld.tvclip.video || ld.tvclip.videoobject));
    */
    if (!json) { // try to find video attached to main object
        var mainObjWithVideo = ld && Object.values(ld).find((obj) => obj.video || obj.videoobject);
        if (mainObjWithVideo) {
            json = mainObjWithVideo.video || mainObjWithVideo.videoobject;
        }
    }

    if (json && Array.isArray(json) && json.length === 1) {
        json = json[0];
    }

    return json; // if any
}

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
 export function getImageMetadata(uri, options, callback){

    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    options = options || {};

    cache.withCache("image-meta:" + uri, function(callback) {

        var loadImageHead, imageResponseStarted, totalTime, timeout, contentLength;
        var abortController;

        function finish(error, data) {

            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            } else {
                return;
            }

            // We don't need more data. Abort causes error. timeout === null here so error will be skipped.
            abortController && abortController.abort();

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
                    asBuffer: true
                }, {
                    onResponse: function(res) {

                        abortController = res.abortController;

                        var content_type = res.headers['content-type'];

                        if (content_type && content_type !== 'application/octet-stream' && content_type !== 'binary/octet-stream') {

                            if (content_type.indexOf('image') === -1 && !uri.match(/\.(jpg|png|gif|webp)(\?.*)?$/i)) {
                                return finishCb('invalid content type: ' + content_type, undefined, 'onResponse content_type');
                            }
                        }

                        if (res.status == 200) {
                            if (options.debug) {
                                imageResponseStarted = totalTime();
                            }
                            contentLength = parseInt(res.headers['content-length'] || '0', 10);
                            imagesize(res).then(function(data) {
                                if (data && data.type) {
                                    data.format = data.type;
                                }
                                finishCb(null, data, 'imagesize');
                            }, function(error) {
                                finishCb(error, null, 'imagesize');
                            });
                        } else {
                            finishCb(res.status, undefined, 'onResponse !200');
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

export function getUriStatus(uri, options, callback) {

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

        getUriStatusPrivate(uri, options, finish);

    }, {
        // Ignore proxy.cache_ttl, if options.cache_ttl === 0 - do not read from cache.
        refresh: options.refresh || options.cache_ttl === 0,
        doNotWaitFunctionIfNoCache: options.doNotWaitFunctionIfNoCache,
        ttl: getMaxCacheTTL(uri, options, CONFIG.IMAGE_META_CACHE_TTL),
        multiCache: options.multiCache
    }, callback);
};

export function getContentType(uriForCache, uriOriginal, options, cb) {

    cache.withCache("content-type:" + uriForCache, function(cb) {

        var timeout, totalTime, abortController;

        function finish(error, headers) {

            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            } else {
                return;
            }

            // We don't need more data. Abort causes error. timeout === null here so error will be skipped.
            // If 'abortController' not defined, then no request created?
            abortController && abortController.abort();

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
                if (headers.request_headers?.origin) data.request_origin = headers.request_headers.origin;
                if (headers['accept-ranges']) data.accept_ranges = headers['accept-ranges'];
                if (headers['url'] && headers['url'] !== uriOriginal) data.url = headers['url'];

                if (options.debug) {
                    data._headers = headers;
                }
            }

            cb(null, data);
        }

        timeout = setTimeout(function() {
            finish("timeout");
        }, options.timeout || CONFIG.RESPONSE_TIMEOUT);

        if (options.debug) {
            totalTime = createTimer();
        }

        function makeCall(uri, method) {

            var methodCaller = method && method === 'GET' ? getUrlFunctional : getHeadFunctional;

            methodCaller(uri, {
                timeout: options.timeout || CONFIG.RESPONSE_TIMEOUT
            }, {
                onResponse: function(res, request_options) {

                    abortController = res.abortController;

                    var error = res.status && res.status != 200 ? res.status : null;

                    if (method !== 'GET'
                        // If method HEAD is not allowed. ex. Amazon S3 (=403)
                        // Try call with GET.
                        && (error === 405 
                            || error === 403 
                            || error === 400 
                            || error === 418
                            || error >= 500
                            // Or ClourFront that gobbles up headers when checking CORS.
                            || (res.headers && !res.headers['access-control-allow-origin']
                                && (res.headers['server'] === 'AmazonS3' || /origin/i.test(res.headers['vary'])) && !error ))) {
                        makeCall(uriOriginal, 'GET');
                        return;
                    }

                    // Final destination url if Fetch follows 301/302 re-directs
                    if (res.url && res.url !== uriOriginal && res.headers) {
                        res.headers.url = res.url;

                    // If we changed the URL to HTTPs ourselves
                    } else if (uri !== uriOriginal && res.headers) {
                        res.headers.url = uri;
                    }

                    if (request_options?.headers && res.headers) {
                        res.headers.request_headers = Object.fromEntries(Object.entries(request_options.headers).map(([k, v]) => [k.toLowerCase(), v]));
                    }

                    finish(error, res.headers);
                },

                onError: function(error) {

                    if (uri !== uriOriginal) {
                        makeCall(uriOriginal, 'HEAD');
                        return;
                    }
                    finish(error);
                }
            });
        }

        // Let's try to upgrade HTTP URLs to HTTPs. 
        // If the upgrade doen't work, repeat with the original `uri`.
        var httpsUri; 
        if (/^http:\/\//.test(uriOriginal)) {
            httpsUri = uriOriginal.replace(/^http:\/\//, 'https://');
        }

        // Call HEAD.
        makeCall(httpsUri || uriOriginal, 'HEAD');

    }, {
        // Ignore proxy.cache_ttl, if options.cache_ttl === 0 - do not read from cache.
        refresh: options.refresh || options.cache_ttl === 0,
        ttl: getMaxCacheTTL(uriOriginal, options, CONFIG.CACHE_TTL),
    }, cb);
};

export function unifyDuration(duration) {
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

export function unifyDate(date) {

    if (!date) {
        return null;
    }

    if (Array.isArray(date)) {
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

        try {
            return date.toISOString().replace(/T.+$/, ''); // Remove time (no timezone).
        } catch(ex) {
            log(' -- error parsing date', date);
            return null;
        }
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


export function lowerCaseKeys(obj) {
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

export function sendLogToWhitelist(uri, context) {

    const {meta, oembed, oembedLinks, whitelistRecord} = context;

    if (!CONFIG.WHITELIST_LOG_URL) {
        return;
    }

    if (/^(https?:)?\/\/[^\/]+\/?$/i.test(uri) 
        || /^(https?:)?\/\/[^\/]+:\d+/.test(uri)) {
        // Skip base domain url and urls with port numbers.
        return;
    }

    const ignorelist_re = /test|staging|sex|porn|fuck|gay|xx|nsfw/;
    if (ignorelist_re.test(uri) || meta && ignorelist_re.test(meta.title + meta['html-title'] + meta.description + meta.keywords)) {
        return;
    }

    const ignoreHostedContext = CONFIG.WHITELIST_LOG_IGNORE_HOSTED_CONTEXT || ['video_src', 'oembed_domain', 'twitter_domain', 'whenWBIR', 'jotFormSrc'];
    if (ignoreHostedContext.some(e => !!context[e]) || whitelistRecord.exclusiveRel) {
        // Try and skip hosted
        return;
    }

    var oembedHref = oembedLinks && oembedLinks.length && oembedLinks[0].href;

    if (oembedHref && oembedHref.match(/\/wp-json\//)) {
        return;
    }

    var data = getWhitelistLogData(meta, oembed, uri);

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

        // TODO: check options
        fetchStream({
            qs: data,

            // Reviewed.
            uri: CONFIG.WHITELIST_LOG_URL,
            method: 'GET',
        })
            .then(res => {
                if (res.status !== 200) {
                    console.error('Error logging url:', uri, res.status);
                }
            })
            .catch(error => {
                console.error('Error logging url:', uri, error);
            });
    }
};

export function filterLinks(data, options) {

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

export function generateLinksHtml(data, options) {

    // Links may be grouped.

    var links = data.links;

    options.iframelyData = data;

    if (CONFIG.GENERATE_LINK_PARAMS) {
        Object.assign(options, CONFIG.GENERATE_LINK_PARAMS);
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
        var plain_data = Object.assign({}, data, {links:links_list});

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

var getUriStatusPrivate = function(uri, options, cb) {

    var request_options = prepareRequestOptions({
        // Reviewed.
        uri: uri,
        method: 'GET',
        headers: {
            'User-Agent': CONFIG.USER_AGENT
        },
        timeout: options.timeout || CONFIG.RESPONSE_TIMEOUT,
        follow: CONFIG.MAX_REDIRECTS
    })

    try {
        fetchStream(request_options)
            .then(res => {
                // TODO: may cause AbortError before cb.
                res.abortController.abort();
                var data = {
                    code: res.status,
                    content_type: res.headers && res.headers['content-type'],
                    content_length: res.headers && res.headers['content-length'] ? parseInt(res.headers['content-length'] || '0', 10) : null
                };
                if (options.checkHeaders) {
                    data.headers = res.headers;
                }
                cb(null, data);
            })
            .catch(cb)
    } catch (ex) {
        cb(ex.message);
    }
};

export function createTimer() {

    var timer = new Date().getTime();

    return function() {
        return new Date().getTime() - timer;
    };
};

var SHOPIFY_OEMBED_URLS = ['shopify.com', '/collections/', '/products/'];

function isInterestingPlayer(data, canonical) {
    if (!data || typeof data !== 'string' && !(data.url || data.value)) {
        return false;
    }

    var url = data && (data.url || data.value || data);

    if (/\.(mp4|m4v|m3u8|mp3|swf|webm)(\?.*)?$/i.test(url)
        || /^(https?:)?\/\/\/?$/.test(url)
        || !/^(https?:)?\/\//.test(url)
        || CONFIG.KNOWN_VIDEO_SOURCES.test(url)
        || /^https:\/\/glimmer\.hearstapps.com\/?id=/i.test(url)        
        ) {
        return false;
    }

    if (Array.isArray(canonical)) {
        canonical = canonical[0];
    }
    return url !== canonical;
}

function getWhitelistLogData(meta, oembed, uri) {

    var r = {};

    if (meta) {

        var canonical = meta.canonical || meta.og && meta.og.url || uri;
        var isJetpack = meta.twitter && meta.twitter.card === 'jetpack';
        var isWordpress = oembed && /wp\-embedded\-content/.test(oembed.html) || meta.generator && /wordpress/i.test(meta.generator);
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

        /** 
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
        */

        r.twitter_player =
            !!meta.twitter && !!meta.twitter.player && isInterestingPlayer(meta.twitter.player.value, canonical);

        r.twitter_stream =
            !!meta.twitter && !!meta.twitter.player && isInterestingPlayer(meta.twitter.player.stream, canonical);

        r.og_video =
            !!meta.og && !!meta.og.video
            && isInterestingPlayer(meta.og.video.url, canonical);

        var ld = meta.ld;
        if (ld) {
            var json = ld.videoobject || ld.mediaobject;
            if (!json) { // try to find video attached to main object
                var mainObjWithVideo = ld && Object.values(ld).find((obj) => obj.video || obj.videoobject);
                if (mainObjWithVideo) {
                    json = mainObjWithVideo.video || mainObjWithVideo.videoobject;
                }
            }

            if (json) {
                var embedURL = json.embedurl || json.embedUrl || json.embedURL || json.contenturl || json.contentUrl || json.contentURL;
                r.embedURL = isInterestingPlayer(embedURL, canonical);
            }
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

export function getIframelyErrorShortCode(error) {

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

/**
 * @public
 * Generate slug for provider based on domain name of URL provided
 * @param url Request uri string
 */
export function getProviderName(url) {

    try {
        var domain = url.match(/^https?:\/\/([^\/\?#]+)/)[1];
        var provider = domain.match(/([^\.\/\?]+)\.(?:com?\.)?[a-z]+$/)[1];
        return provider.replace(/\./g, '-');
    } catch(ex) {
        return undefined;
    }
}

function extractDomain(uri) {
    var m = uri.toLowerCase().match(/^(?:https?:\/\/)?(?:www\.)?([^/\?]+)/i);
    if (m) {
        return m[1];
    } else {
        return null;
    }
}
export function isBlocked(url, options, cb) {
    // list of regex blocklisted by the user
    var blocklist = options.getProviderOptions('blacklist');
    var domain = extractDomain(url);

    return  blocklist 
        && Array.isArray(blocklist)
        && blocklist.some(function(item) {
            if (item instanceof RegExp) {
                return item.test(url);
            } else if (typeof item === 'string') {

                // Remove www.
                item = item.replace(/^www\./gi, '');
                // Escape dots
                item = item.replace(/\./gi, '\\.');
                // "*" -> /.+/
                item = item.replace(/\*/gi, '.+');

                var re = new RegExp('^' + item + '$');

                return re.test(domain);
            }
        });
}
