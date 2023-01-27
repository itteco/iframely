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
        await client.connect();
    }

    export async function set(key, data, options) {
        try {
            await client.multi()
            .set(key, JSON.stringify(data))
            .expire(key, options && options.ttl || CONFIG.CACHE_TTL)
            .exec()
        } catch (err) {
            log('   -- Redis set error ' + key + ' ' + err);
        }
    };

    export async function get(key, cb) {
        try {
            const data = await client.get(key);

            if (typeof data !== 'string') {
                return cb(null, data);
            }

            try {
                var parsedData = JSON.parse(data);
            } catch (ex) {
                return cb(ex);
            }

            cb(null, parsedData);

        } catch (err) {
            log('   -- Redis get error ' + key + ' ' + err);
            return cb(null, null);
        }
    };
