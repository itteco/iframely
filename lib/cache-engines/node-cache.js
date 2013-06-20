(function(cache) {

    var NodeCache = require("node-cache");
    var defaultCache = new NodeCache( { stdTTL: 60 * 60 * 24, checkperiod: 60 * 60 * 1 } );

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

})(exports);