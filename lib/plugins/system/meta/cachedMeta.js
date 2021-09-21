var urlLib = require('url');
var cache = require('../../../cache');
var sysUtils = require('../../../../logging');
var utils = require('./utils');
var libUtils = require('../../../utils');

module.exports = {

    provides: [
        '__noCachedMeta',
        '__hasCachedMeta',
        'meta',

        // htmlparser caching stuff.
        'htmlparser',   // Need to provide 'htmlparser', because of mandatory params in second level it will never load itself.
        '__noCachedHtmlparserFallback',
        '__nonHtmlContentData',
        '__statusCode'
    ],

    getData: function(url, options, whitelistRecord, cb) {

        // Ignore proxy.cache_ttl, if options.cache_ttl === 0 - do not read from cache.
        if (options.refresh || options.cache_ttl === 0) {

            cb(null, {
                __noCachedMeta: true,
                __noCachedHtmlparserFallback: true
            });

        } else {

            var meta_key = utils.getMetaCacheKey(url, whitelistRecord, options);

            function callback(error, data) {

                if (error) {
                    sysUtils.log('   -- Error loading cached meta for: ' + url + '. ' + error);
                }

                function noCacheFound() {
                    cb(null, {
                        __noCachedMeta: true,
                        __noCachedHtmlparserFallback: true
                    });
                }

                if (!error && data) {

                    if (typeof data._sys_created_at === 'number') {
                        var proxy = libUtils.getMaxCacheTTLOverride(url, options);
                        if (proxy && proxy.cache_ttl) {
                            // Skip check for ttl overriden by config.
                        } else {
                            var ttl = libUtils.getMaxCacheTTL(url, options);
                            var record_age_sec = (new Date().getTime() / 1000) - data._sys_created_at;
                            if (record_age_sec > ttl) {
                                // Ignore cache older then requested ttl.
                                sysUtils.log('   -- Disable using old cache for: ' + url);
                                return noCacheFound();
                            }
                        }

                        delete data._sys_created_at;
                    }

                    if (data.error) {

                        if (data.error.redirect) {
                            var redirectUrl = urlLib.resolve(url, data.error.redirect);
                            if (redirectUrl === url) {
                                // Prevent cache self redirect. Some sites changes cookies and stops redirect loop (e.g. https://miro.com/app/live-embed/o9J_lBwNMhI=/?embedAutoplay=true)
                                return noCacheFound();
                            }
                        }

                        // If data object has error attribute - return as error (e.g. redirect).
                        sysUtils.log('   -- Using cached htmlparser error for: ' + url);
                        cb(data.error);
                    } else if (data.htmlparser) {
                        sysUtils.log('   -- Using cached htmlparser data for: ' + url);
                        cb(null, data.htmlparser);
                    } else {
                        sysUtils.log('   -- Using cached meta for: ' + url);
                        cb(null, {
                            meta: data,
                            __hasCachedMeta: true,
                            __noCachedHtmlparserFallback: true
                        });
                    }

                } else {
                    noCacheFound();
                }
            }

            cache.get(meta_key, callback);
        }
    }

};