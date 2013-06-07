(function(cache) {

    var NodeCache = require("node-cache");
    var defaultCache = new NodeCache( { stdTTL: 60 * 60 * 24, checkperiod: 60 * 60 * 1 } );

    cache.setCachingCallbacks = function(setCallback, getCallback) {
        cache.set = setCallback;
        cache.get = getCallback;
    };

    cache.set = function(key, data) {
        defaultCache.set(key, data);
    };

    cache.get = function(key, cb) {
        defaultCache.get(key, function(error, data) {
            if (error) {
                return cb(error, null);
            }

            if (data && key in data) {
                cb(null, data[key]);
            } else {
                cb(null, null);
            }
        });
    };

    cache.withCache = function(key, func, callback, disableCache) {

        var exec = function() {
            func(function(error, data) {
                if (error) {
                    callback(error);

                } else {
                    cache.set(key, data);
                    callback(error, data);
                }
            });
        };

        if (disableCache) {

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