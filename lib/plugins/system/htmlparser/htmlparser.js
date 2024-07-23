import * as urlLib from 'url';
import { Parser } from 'htmlparser2';
import { cache } from '../../../cache.js';
import * as utils from '../../../utils.js';
import * as libUtils from '../../../utils.js';
import * as metaUtils from '../meta/utils.js';
import { extendCookiesJar } from '../../../fetch.js';
var getUrlFunctional = utils.getUrlFunctional;
import { CollectingHandlerForMutliTarget } from './CollectingHandlerForMutliTarget.js';

export default {

    provides: [
        'self',
        '__nonHtmlContentData',
        '__statusCode'
    ],

    getData: function(url, whitelistRecord, options, __noCachedHtmlparserFallback, cb) {

        var options2 = {...options, ...{
            followRedirect: !!options.followHTTPRedirect,
            reuseCookies: !!options.followHTTPRedirect
        }};

        getUrlFunctional(url, options2, {
            onError: function(error) {
                if (error.code === 'ENOTFOUND') {
                    if (!!options.exposeStatusCode) {
                        cb(null, {
                            __statusCode: 404,
                            headers: {}
                        });
                    } else {
                        cb({
                            responseStatusCode: 404
                        });
                    }
                } else {
                    if (!!options.exposeStatusCode && error === 'timeout') {
                        cb(null, {
                            __statusCode: 408,
                            headers: {}
                        });
                    } else if (!!options.exposeStatusCode 
                            && (error.message === 'too_many_redirects' || error === 'too_many_redirects')) {

                        cb(null, {
                            __statusCode: 508, // Hello Instagram, see #503
                            headers: {}
                        });

                    } else {
                        cb({
                            responseError: error
                        });
                    }
                }
            },
            onResponse: function(resp) {

                function cacheAndRespond(error, data) {

                    // Use proxy.cache_ttl or options.cache_ttl.
                    var ttl = libUtils.getMaxCacheTTL(url, options);

                    if (resp.status >= 400 && ttl > CONFIG.CACHE_ERROR_TTL) {
                        // Decrease ttl for error response codes.
                        ttl = CONFIG.CACHE_ERROR_TTL;
                    }

                    // Do not store to cache with ttl == 0.
                    // Do not store if options.cache_ttl not specified.
                    if (ttl !== 0) {

                        var cachedData;

                        if (error) {
                            cachedData = {
                                error: error
                            };
                        } else {
                            // Store as 'htmlparser' data to know it is not cached 'meta'.
                            cachedData = {
                                htmlparser: data
                            };
                        }

                        var key = metaUtils.getMetaCacheKey(url, whitelistRecord, options);

                        cache.set(key, cachedData, {
                            ttl: ttl
                        });
                    }

                    if (error) {
                        cb(error);    
                    } else {
                        cb(null, data);
                    }
                }

                const headers = resp.headers;
                const abortController = resp.abortController;

                if (resp.status >= 300 && resp.status < 400 && headers.location) {
                    if (options.exposeStatusCode && options.followHTTPRedirect === false) {
                        return cacheAndRespond(null, {
                            __statusCode: resp.status,
                            headers: headers
                        });
                    } else {

                        // Prevent cache self redirect. Some sites changes cookies and stops redirect loop (e.g. https://miro.com/app/live-embed/o9J_lBwNMhI=/?embedAutoplay=true)
                        const redirectUrl = urlLib.resolve(url, headers.location);
                        const preventCache = redirectUrl === url;
                        options.jar = extendCookiesJar(options.jar, headers);
                        // TODO: do not cache when has unique cookie???
                        if (options2.maxRedirects && (!options.redirectsHistory || options.redirectsHistory.length === 0)) {
                            options.maxRedirects = options2.maxRedirects; // Maybe set in prepareRequestOptions for a proxy.
                        }
                        return cacheAndRespond({
                            redirect: headers.location
                        }, null, preventCache);                        
                    }
                }

                if (resp.status !== 200) {
                    if (!!options.exposeStatusCode) {
                        return cacheAndRespond(null, {
                            __statusCode: resp.status,
                            headers: headers
                        });
                    } else {
                        return cacheAndRespond({
                            responseStatusCode: resp.status
                        });
                    }
                }

                if('content-type' in headers && !/text\/html|application\/xhtml\+xml/gi.test(headers['content-type'])){
                    abortController.abort();

                    return cacheAndRespond(null, {
                        __nonHtmlContentData: {
                            type: headers['content-type'],
                            content_length: headers['content-length'],
                            'set-cookie': headers['set-cookie']
                        },
                        headers: headers
                    });
                }

                // Init htmlparser handler.
                var handler = new CollectingHandlerForMutliTarget();
                handler.onNoHandlers = function() {
                    if (!resp.isPaused()) {
                        resp.pause();
                    }
                };
                handler.onFirstHandler = function() {
                    if (resp.isPaused()) {
                        resp.resume();
                    }
                };
                var parser = new Parser(handler, {
                    lowerCaseTags: true,
                    decodeEntities: false   // Fixes decoding html characters like &nbsp; to UTF-8, we have own decoders.
                });
                handler.headers = headers;
                handler.abortController = abortController;
                handler.h2 = resp.h2;

                // Do before resume?
                cb(null, {
                    htmlparser: handler
                });

                // Proxy data.
                resp.on('data', parser.write.bind(parser));
                resp.on('end', parser.end.bind(parser));
            }
        });
    }
};