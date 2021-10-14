    import * as sysUtils from '../../logging.js';

    var client;

    if (CONFIG.REDIS_MODE === 'cluster') {
        var pkg = await import('redis-clustr');
        client = new pkg.RedisClustr(CONFIG.REDIS_CLUSTER_OPTIONS);
    } else {
        var pkg = await import('redis');
        client = pkg.redis.createClient(CONFIG.REDIS_OPTIONS);
    }

    export function set(key, data, options) {
        var multi = client.multi();
        multi.set(key, JSON.stringify(data));
        multi.expire(key, options && options.ttl || CONFIG.CACHE_TTL);

        multi.exec(function(error) {
            if (error) {
                sysUtils.log('   -- Redis set error ' + key + ' ' + error);
            }
        });
    };

    export function get(key, cb) {

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