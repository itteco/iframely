(function(cache) {

    var DEFAULT_CACHE = "node-cache";

    function setCachingEngine(id) {
        try {

            var cache_engine = require('./cache-engines/' + id);

            if (!cache_engine.set || !cache_engine.get) {
                console.warn("Default cache engine used. No get and set methods in cache engine", id);
                return setCachingEngine(DEFAULT_CACHE);
            }

            cache.set = function(key, data, options) {
                var custom_ttl = options && options.ttl;
                if (custom_ttl !== 0) {
                    // Do not store with ttl === 0.
                    cache_engine.set(key, data, options);
                }
            };
            // TODO: do not get if ttl === 0 ?
            cache.get = cache_engine.get;

            if (cache_engine.getClient) {
                cache[id] = cache_engine.getClient();
            }

            console.log("Using cache engine:", id);

        } catch (ex) {
            if (id == DEFAULT_CACHE) {
                throw ex;
            } else {
                console.warn("Default cache engine used. Check CONFIG.CACHE_ENGINE. ", ex.stack);
                setCachingEngine(DEFAULT_CACHE);
            }
        }
    }

    setCachingEngine(CONFIG.CACHE_ENGINE || DEFAULT_CACHE);

    cache.withCache = function(key, func, options, callback) {

        if (typeof options === 'function') {
            callback = options;
            options = null;
        }

        var doNotWaitFunctionIfNoCache = options && options.doNotWaitFunctionIfNoCache;

        var exec = function() {

            if (doNotWaitFunctionIfNoCache) {
                callback(null, null);
            }

            func(function(error, data) {

                if (error) {

                    if (doNotWaitFunctionIfNoCache) {
                        // Stop.
                        return;
                    }

                    callback(error);

                } else {

                    cache.set(key, data, options);

                    if (doNotWaitFunctionIfNoCache) {
                        // Stop.
                        return;
                    }

                    callback(error, data);
                }
            });
        };

        if (options && options.disableCache) {

            exec();

        } else {

            cache.get(key, function(error, data) {

                if (!error && data) {

                    callback(null, data);

                } else {

                    exec();
                }
            });
        }
    };

})(exports);