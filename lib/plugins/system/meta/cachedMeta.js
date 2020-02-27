var cache = require('../../../cache');
var sysUtils = require('../../../../logging');
var utils = require('./utils');

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

                if (!error && data) {

                    if (data.error) {
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

                    cb(null, {
                        __noCachedMeta: true,
                        __noCachedHtmlparserFallback: true
                    });
                }
            }

            cache.get(meta_key, callback);
        }
    }

};