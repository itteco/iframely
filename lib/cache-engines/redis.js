(function(engine) {

    var redis = require('redis');
    var client = redis.createClient(
        CONFIG.REDIS_OPTIONS && CONFIG.REDIS_OPTIONS.port,
        CONFIG.REDIS_OPTIONS && CONFIG.REDIS_OPTIONS.host);

    engine.set = function(key, data) {
        client.set(key, JSON.stringify(data));
    };

    engine.get = function(key, cb) {

        client.get(key, function(error, data) {

            if (error) {
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