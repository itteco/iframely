(function(cache) {

    var DEFAULT_CACHE = "node-cache"

    function setCachingEngine(id) {
        try {

            var cache_engine = require('./cache-engines/' + id);

            if (!cache_engine.set || !cache_engine.get) {
                console.warn("Default cache engine used. No get and set methods in cache engine", id);
                return setCachingEngine(DEFAULT_CACHE);
            }

            cache.set = cache_engine.set;
            cache.get = cache_engine.get;

            console.log("Using cache engine:", id);

        } catch (ex) {
            if (id == DEFAULT_CACHE) {
                throw ex;
            } else {
                console.warn("Default cache engine used. Check CONFIG.CACHE_ENGINE. ", ex.stack);
                setCachingEngine(DEFAULT_CACHE);
            }
        }
    };

    setCachingEngine(CONFIG.CACHE_ENGINE || DEFAULT_CACHE);

    cache.withCache = function(key, func, options, callback) {

        if (typeof options === 'function') {
            callback = options;
            options = null;
        }

        var exec = function() {
            func(function(error, data) {
                if (error) {
                    callback(error);

                } else {
                    cache.set(key, data, options);
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