import * as crypto from 'crypto';
import { cache } from './cache.js';
import * as utils from './utils.js';
import log from '../logging.js';

import { fetchData } from './fetch.js';

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

/*

TOOD:

options:

jar: false,
limit: 1, 

oauth

*/

export default function(options, iframely_options, callback) {

    options = Object.assign({}, options);

    if (typeof options.prepareResult !== 'function') {
        console.error('cached request call error: prepareResult not a function');
    }

    var refresh = options.refresh;
    var prepareResult = options.prepareResult;
    var allowCache = options.allowCache;
    var useCacheOnly = options.useCacheOnly;
    var ttl = utils.getMaxCacheTTL(options.url || options.uri, iframely_options, CONFIG.API_REQUEST_CACHE_TTL);
    var cache_key = options.cache_key;
    var new_cache_key = options.new_cache_key; // this is to allow temp migration

    if (allowCache && typeof allowCache !== 'function') {
        console.error('cached request call error: allowCache not a function');
    }

    delete options.prepareData;
    delete options.useCacheOnly;
    delete options.cache_key;
    delete options.new_cache_key;
    delete options.refresh;

    var prefix = CONFIG.API_REQUEST_CACHE_PREFIX ? (CONFIG.API_REQUEST_CACHE_PREFIX + ':') : '';

    var lang = iframely_options.getProviderOptions('locale');
    if (lang) {
        prefix += lang + ':';
    }

    var key = 'req:' + prefix + (cache_key || hash(JSON.stringify(options)));

    function doRealRequest(secondAttempt) {

        function finish(error, result) {
            if (error) {
                // Retry on ECONNRESET.
                if (!secondAttempt && (error.code in CONFIG.HTTP2_RETRY_CODES)) {
                    log('   -- request.js ' + error.code + ' first', options.uri);
                    process.nextTick(function() {
                        doRealRequest(true);
                    });
                    return;
                } else if (secondAttempt && (error.code in CONFIG.HTTP2_RETRY_CODES)) {
                    log('   -- request.js ' + error.code + ' second', options.uri);
                }
            }

            if (error) {
                iframely_options.registerFetchError({
                    source: 'api',
                    url: options.uri,
                    error: error
                });
            } else if (result && result.status !== 200) {
                iframely_options.registerFetchError({
                    source: 'api',
                    url: options.uri,
                    status_code: result.status
                });
            }

            const response = result && {
                statusCode: result.status,
                headers: result.headers
            };
            const data = result && result.data;

            prepareResult(error, response, data, function(preparedError, preparedData) {

                var doCaching;
                if (allowCache) {
                    doCaching = allowCache(error, response, data);
                } else {
                    doCaching = !preparedError;
                }

                if (doCaching) {
                    // If data prepared without error - cache it.
                    cache.set(key, {
                        response: {
                            statusCode: response && response.statusCode,
                            headers: response && response.headers
                        },
                        data: data
                    }, {
                        ttl: ttl
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
                            ttl: ttl
                        });
                    }
                }

                // Send prepared data up.
                callback(preparedError, preparedData);
            });
        }

        if (!options.headers || !options.headers['User-Agent']) {
            options.headers = options.headers || {};
            options.headers['User-Agent'] = CONFIG.USER_AGENT;
        }

        iframely_options.registerFetch({
            source: 'api',
            url: options.uri
        });

        fetchData(utils.prepareRequestOptions(options, {
            ...iframely_options, 
            prevent_prerender: true
        }))
            .then(result => {
                finish(null, result);
            })
            .catch(finish);
    }

    if (refresh) {
        return doRealRequest();
    }

    // Ignore proxy.cache_ttl, if options.cache_ttl === 0 - do not read from cache.
    if (iframely_options.cache_ttl === 0) {

        if (useCacheOnly) {
    
            callback('no-cache');

        } else {

            doRealRequest();
        }

    } else {

        cache.get(key, function(error, data) {
    
            if (!error && data) {

                if (allowCache) {
                    var doCaching = allowCache(null, data.response, data.data);
                    if (!doCaching) {
                        // Skip existing cache if cache not allowed for data.
                        doRealRequest();
                        return;
                    }
                }

                iframely_options.registerFetch({
                    source: 'cache',
                    url: options.uri
                });
    
                // Send cached data up.
                prepareResult(null, Object.assign(data.response, {fromRequestCache: true}), data.data, callback);
    
                if (new_cache_key) {
                    cache.set('req:' + prefix + new_cache_key, data, {
                        ttl: ttl
                    });
                }
    
            } else if (useCacheOnly) {
    
                callback('no-cache');
    
            } else {
    
                doRealRequest();
            }
        });
    }
};
