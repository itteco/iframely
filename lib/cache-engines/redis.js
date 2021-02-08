(function(engine) {

    var sysUtils = require('../../logging');

    var client;

    if (CONFIG.REDIS_MODE === 'cluster') {
        var RedisClustr = require('redis-clustr');

        client = new RedisClustr(CONFIG.REDIS_CLUSTER_OPTIONS);
    } else {
        var redis = require('redis');
        client = redis.createClient(CONFIG.REDIS_OPTIONS);
    }

    engine.set = function(key, data, options) {
        var multi = client.multi();
        multi.set(key, JSON.stringify(data));
        multi.expire(key, options && options.ttl || CONFIG.CACHE_TTL);

        multi.exec(function(error) {
            if (error) {
                sysUtils.log('   -- Redis set error ' + key + ' ' + error);
            }
        });
    };

    engine.get = function(key, cb) {

        client.get(key, function(error, data) {

            if (error) {
                sysUtils.log('   -- Redis get error ' + key + ' ' + error);
                return cb(null, null);
            }

            if (typeof data !== 'string') {
                return cb(null, data);
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
