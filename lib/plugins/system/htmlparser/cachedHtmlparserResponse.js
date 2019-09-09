var cache = require('../../../cache');
var sysUtils = require('../../../../logging');
var htmlparserUtils = require('./utils');

module.exports = {

    provides: [
        'htmlparser',   // Need to provide 'htmlparser', bacause of mandatory params in second level it will never load itself.
        '__noCachedHtmlparserResponse',
        '__nonHtmlContentData',
        '__statusCode'
    ],

    getData: function(url, options, whitelistRecord, cb) {

        if (options.refresh || options.cache_ttl === 0 || !options.cache_ttl) {

            // Do not get if options.cache_ttl not specified.

            cb(null, {
                __noCachedHtmlparserResponse: true
            });

        } else {

            var key = htmlparserUtils.getHtmlparserResponseCacheKey(url, whitelistRecord, options);

            function callback(error, data) {

                if (error) {
                    sysUtils.log('   -- Error loading cached htmlparser response for: ' + url + '. ' + error);
                }

                if (!error && data) {

                    sysUtils.log('   -- Using cached htmlparser response for: ' + url);

                    if (data.error) {
                        // If data object has error attribute - return as error (e.g. redirect).
                        return cb(data.error);
                    } else {
                        return cb(null, data);
                    }

                } else {

                    cb(null, {
                        __noCachedHtmlparserResponse: true
                    });
                }
            }

            cache.get(key, callback);
        }
    }

};