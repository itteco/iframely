(function(engine) {

    var redis = require('redis');
    var client = redis.createClient(
        CONFIG.REDIS_OPTIONS && CONFIG.REDIS_OPTIONS.port,
        CONFIG.REDIS_OPTIONS && CONFIG.REDIS_OPTIONS.host);

    engine.set = function(key, data) {
        var multi = client.multi();
        multi.set(key, JSON.stringify(data));
        multi.expire(key, CONFIG.CACHE_TTL);
        multi.exec(function(error) {
            if (error) {
                console.error("redis set error", error);
            }
        });
    };

    engine.get = function(key, cb) {

        client.get(key, function(error, data) {

            if (error) {
                console.error("redis get error", error);
                return cb(error);
            }

            try {
                var parsedData = JSON.parse(data);
            } catch(ex) {
                return cb(ex);
            }

            cb(null, parsedData);
        });
    };

})(exports);