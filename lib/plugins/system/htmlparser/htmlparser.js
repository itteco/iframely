var _ = require('underscore');
var htmlparser2 = require('htmlparser2');
var Parser = htmlparser2.Parser;

var utils = require('../../../utils');
var htmlparserUtils = require('./utils');
var getUrl = utils.getUrl;

var CollectingHandlerForMutliTarget = require('./CollectingHandlerForMutliTarget');

module.exports = {

    provides: [
        'self',
        '__nonHtmlContentData',
        '__statusCode'
    ],

    getData: function(url, whitelistRecord, options, __noCachedHtmlparserResponse, cb) {

        var request;

        getUrl(url, _.extend({}, options, {
            followRedirect: !!options.followHTTPRedirect
        }))
            .on('error', function(error) {
                if (error.code === 'ENOTFOUND') {
                    cb({
                        responseStatusCode: 404
                    });
                } else {
                    cb({
                        responseError: error
                    });
                }
            })
            .on('request', function(req) {
                request = req;
            })
            .on('response', function(resp) {

                function cacheAndRespond(error, data) {

                    var skip_cache = false;

                    // TODO: match all 5xx codes?
                    if (CONFIG.TEMP_HTTP_ERROR_CODES.indexOf(resp.statusCode) > -1) {
                        // Skip caching TEMP_HTTP_ERROR_CODES.
                        skip_cache = true;
                    }

                    // Do not store to cache with ttl == 0.
                    // Do not store if options.cache_ttl not specified.
                    if (!skip_cache && options.cache_ttl) {

                        if (error) {
                            data = {
                                error: error
                            };
                        }

                        var key = htmlparserUtils.getHtmlparserResponseCacheKey(url, whitelistRecord, options);

                        cache.set(key, data, {
                            ttl: options.cache_ttl
                        });
                    }

                    if (error) {
                        cb(error);    
                    } else {
                        cb(null, data);
                    }
                }

                if (resp.statusCode >= 300 && resp.statusCode < 400) {
                    utils.abortRequest(request);
                    return cacheAndRespond({
                        redirect: resp.headers.location
                    });
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
            });
    },

    getLink: function(url, __nonHtmlContentData, options, cb) {
        var nonHtmlContentType = __nonHtmlContentData.type;
        var nonHtmlContentLength = __nonHtmlContentData.content_length;

        // HEADS UP: do not ever remove the below check for 'javascript' or 'flash' in content type
        // if left allowed, it'll make apps vulnerable for XSS attacks as such files will be rendered as regular embeds
        if (/javascript|flash|application\/json|text\/xml|application\/xml/i.test(nonHtmlContentType)) {
            return cb({
                responseStatusCode: 415
            });
        } else {
            return cb(null, {
                // link to original file URL to keep up with location changes (e.g. MP4)
                href: /video\//i.test(nonHtmlContentType) && options.redirectsHistory ? options.redirectsHistory[0] : url,
                type: nonHtmlContentType,
                content_length: parseInt(nonHtmlContentLength, 10),
                rel: CONFIG.R.file
                // client-side iframely.js will also properly render video/mp4 and image files this way
            });
        }
    }

};