var request = require('request');
var _ = require('underscore');
var crypto = require('crypto');
var cache = require('./cache');
var utils = require('./utils');

var version = require('../package.json').version;

var hash = function(value) {
    return '"' + crypto.createHash('md5').update(value).digest("hex") + '"';
};

/*
* Wrapper for original request lib. Adds caching.
*
* Params:
*
* - options - proxy for original `request` options.
*
* - options.prepareResult - function called as `request` callback with (error, response, data, cb).
*   - error, data - as usual in `request`.
*   - WARNING!!! if prepareResult returns error - nothing will be cached, old cache will not be erased.
*   - response - object with attrs:
*       - statusCode - http status code of request response.
*       - fromRequestCache - true if data got from cache.
*   - cb - callback to receive prepared data from plugin. If plugin sent `error` to this function then _result will not be cached_.
*
* - callback - final callback will called with data received from `prepareResult`.
*
* */
module.exports = function(options, iframely_options, callback) {

    options = _.extend({}, options);

    if (typeof options.prepareResult !== 'function') {
        console.error('cached request call error: prepareResult not a function');
    }

    var refresh = options.refresh;
    var prepareResult = options.prepareResult;
    var useCacheOnly = options.useCacheOnly;
    var ttl = options.ttl;
    var cache_key = options.cache_key;
    var new_cache_key = options.new_cache_key; // this is to allow temp migration

    delete options.prepareData;
    delete options.useCacheOnly;
    delete options.ttl;
    delete options.cache_key;
    delete options.new_cache_key;
    delete options.refresh;

    options.gzip = true;

    var prefix = CONFIG.API_REQUEST_CACHE_PREFIX ? (CONFIG.API_REQUEST_CACHE_PREFIX + ':') : '';

    var lang = iframely_options.getProviderOptions('locale');
    if (lang) {
        prefix += lang + ':';
    }

    var key = 'req:' + prefix + (cache_key || hash(JSON.stringify(options)));

    function doRealRequest() {

        request(utils.prepareRequestOptions(options, iframely_options), function(error, response, data) {

            prepareResult(error, response, data, function(error, preparedData) {

                if (!error) {
                    // If data prepared without error - cache it.
                    cache.set(key, {
                        response: {
                            statusCode: response && response.statusCode,
                            headers: response && response.headers
                        },
                        data: data
                    }, {
                        ttl: ttl || CONFIG.API_REQUEST_CACHE_TTL
                    });

                    // temp cache migration, set new key as well
                    if (new_cache_key) {
                        cache.set('req:' + prefix + new_cache_key, {
                            response: {
                                statusCode: response && response.statusCode,
                                headers: response && response.headers
                            },
                            data: data
                        }, {
                            ttl: ttl || CONFIG.API_REQUEST_CACHE_TTL
                        });
                    }
                }

                // Send prepared data up.
                callback(error, preparedData);
            });
        });
    }

    if (refresh) {
        return doRealRequest();
    }

    cache.get(key, function(error, data) {

        if (!error && data) {

            // Send cached data up.
            prepareResult(null, _.extend(data.response, {fromRequestCache: true}), data.data, callback);

            if (new_cache_key) {
                cache.set('req:' + prefix + new_cache_key, data, {
                    ttl: ttl || CONFIG.API_REQUEST_CACHE_TTL
                });
            }

        } else if (useCacheOnly) {

            callback('no-cache');

        } else {

            doRealRequest();
        }
    });
};