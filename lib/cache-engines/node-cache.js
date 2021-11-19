    import NodeCache from "node-cache";
    import CONFIG from '../../config.loader.js';

    var nodeCache = new NodeCache({
        stdTTL: CONFIG.CACHE_TTL,
        checkperiod: CONFIG.CACHE_TTL / 2
    });

    export function set(key, data, options) {
        nodeCache.set(key, data, options && options.ttl || CONFIG.CACHE_TTL);
    }

    export function get(key, cb) {
        nodeCache.get(key, function(error, data) {
            if (error) {
                return cb(null, null);
            }

            if (data && key in data) {
                cb(null, data[key]);
            } else {
                cb(null, null);
            }
        });
    }