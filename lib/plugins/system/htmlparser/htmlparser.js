var _ = require('underscore');
var urlLib = require('url');
var htmlparser2 = require('htmlparser2');
var Parser = htmlparser2.Parser;

var cache = require('../../../cache');
var utils = require('../../../utils');
var libUtils = require('../../../utils');
var metaUtils = require('../meta/utils');
var getUrlFunctional = utils.getUrlFunctional;

var CollectingHandlerForMutliTarget = require('./CollectingHandlerForMutliTarget');

module.exports = {

    provides: [
        'self',
        '__nonHtmlContentData',
        '__statusCode'
    ],

    getData: function(url, whitelistRecord, options, __noCachedHtmlparserFallback, cb) {

        var request;

        getUrlFunctional(url, _.extend({}, options, {
            followRedirect: !!options.followHTTPRedirect
        }), {
            onError: function(error) {
                if (error.code === 'ENOTFOUND') {
                    cb({
                        responseStatusCode: 404
                    });
                } else {
                    cb({
                        responseError: error
                    });
                }
            },
            onRequest: function(req) {
                request = req;
            },
            onResponse: function(resp) {
                function cacheAndRespond(error, data, preventCache) {

                    var skip_cache = preventCache;

                    if (CONFIG.TEMP_HTTP_ERROR_CODES.indexOf(resp.statusCode) > -1) {
                        // Skip caching TEMP_HTTP_ERROR_CODES.
                        skip_cache = true;
                    }
                    if (resp.statusCode >= 500 && resp.statusCode <= 599) {
                        // Skip caching 5xx errors.
                        skip_cache = true;
                    }

                    // Use proxy.cache_ttl or options.cache_ttl.
                    var ttl = libUtils.getMaxCacheTTL(url, options);

                    // Do not store to cache with ttl == 0.
                    // Do not store if options.cache_ttl not specified.
                    if (!skip_cache && ttl !== 0) {

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

                if (resp.statusCode >= 300 && resp.statusCode < 400 && resp.headers.location) {
                    utils.abortRequest(request);
                    var redirectUrl = urlLib.resolve(url, resp.headers.location);
                    // Prevent cache self redirect. Some sites changes cookies and stops redirect loop (e.g. https://miro.com/app/live-embed/o9J_lBwNMhI=/?embedAutoplay=true)
                    var preventCache = redirectUrl === url;
                    if (!options.exposeStatusCode) {
                        return cacheAndRespond({
                            redirect: resp.headers.location
                        }, null, preventCache);
                    } else {
                        return cacheAndRespond(null, {
                            headers: resp.headers
                        });
                    }
                }

                if (resp.statusCode !== 200) {
                    utils.abortRequest(request);
                    if (!!options.exposeStatusCode) {
                        return cacheAndRespond(null, {
                            __statusCode: resp.statusCode,
                            headers: resp.headers
                        });
                    } else {
                        return cacheAndRespond({
                            responseStatusCode: resp.statusCode
                        });
                    }
                }

                if('content-type' in resp.headers && !/text\/html|application\/xhtml\+xml/gi.test(resp.headers['content-type'])){
                    utils.abortRequest(request);
                    return cacheAndRespond(null, {
                        __nonHtmlContentData: {
                            type: resp.headers['content-type'],
                            content_length: resp.headers['content-length'],
                            'set-cookie': resp.headers['set-cookie']
                        }
                    });
                }

                // Init htmlparser handler.
                var handler = new CollectingHandlerForMutliTarget();
                handler.onNoHandlers = function() {
                    if (!request.response.isPaused()) {
                        request.response.pause();
                    }
                };
                handler.onFirstHandler = function() {
                    if (request.response.isPaused()) {
                        request.response.resume();
                    }
                };
                var parser = new Parser(handler, {
                    lowerCaseTags: true
                });
                handler.request = request;

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