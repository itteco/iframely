(function(cache) {

    var NodeCache = require("node-cache");
    var nodeCache = new NodeCache({
        stdTTL: CONFIG.CACHE_TTL,
        checkperiod: CONFIG.CACHE_TTL / 2
    });

    cache.set = function(key, data, options) {
        nodeCache.set(key, data, options && options.ttl || CONFIG.CACHE_TTL);
    };

    cache.get = function(key, cb) {
        nodeCache.get(key, function(error, data) {
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

})(exports);