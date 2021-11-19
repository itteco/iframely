    import log from '../../logging.js';
    import CONFIG from '../../config.loader.js';

    var client;

    if (CONFIG.REDIS_MODE === 'cluster') {
        const pkg = await import('redis-clustr');
        const RedisClustr = pkg.default;
        client = new RedisClustr(CONFIG.REDIS_CLUSTER_OPTIONS);
    } else {
        var pkg = await import('redis');
        client = pkg.createClient(CONFIG.REDIS_OPTIONS);
    }

    export function set(key, data, options) {
        var multi = client.multi();
        multi.set(key, JSON.stringify(data));
        multi.expire(key, options && options.ttl || CONFIG.CACHE_TTL);

        multi.exec(function(error) {
            if (error) {
                log('   -- Redis set error ' + key + ' ' + error);
            }
        });
    };

    export function get(key, cb) {

        client.get(key, function(error, data) {

            if (error) {
                log('   -- Redis get error ' + key + ' ' + error);
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