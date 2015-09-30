(function(engine) {

    var crypto = require('crypto');

    var Memcached = require('memcached');
    var memcached = new Memcached(CONFIG.MEMCACHED_OPTIONS && CONFIG.MEMCACHED_OPTIONS.locations);

    function safeKey(key) {
        return crypto.createHash('md5').update(key).digest("hex");
    }

    function _findKeyMeta(k) {

        var _ = require('underscore');

        var sk = safeKey(k);

        memcached.items(function(a, b){

            var stubs = _.keys(b[0]);

            stubs.forEach(function(sid) {

                var servers = CONFIG.MEMCACHED_OPTIONS.locations;
                if (servers instanceof Object) {
                    servers = _.keys(servers);
                }
                if (typeof servers === 'string') {
                    servers = [servers];
                }

                servers.forEach(function(s) {
                    memcached.cachedump(s, parseInt(sid), 0, function(a, b) {

                        if (!(b instanceof Array)) {
                            b = [b];
                        }

                        b.forEach(function(k) {
                            if (k.key === sk) {
                                console.log(' - key', k);
                                console.log(' - now is', new Date());
                                console.log(' - exp in', new Date(k.s * 1000));
                            }
                        })
                    });
                });
            });
        });
    }

    engine.set = function(_key, data, options) {

        var key = (!options || !options.raw) ? safeKey(_key) : _key;

        //console.log(key, (!options || !options.raw) ? JSON.stringify(data) : data);

        // Warning: value and lifetime argumets switched, bug in docs.
        // Warning: need replace /n if raw saved. Memcached in nginx read bug.
        memcached.set(key, (!options || !options.raw) ? JSON.stringify(data) : data.replace(/\n/g, ''), options && options.ttl || CONFIG.CACHE_TTL, function(error){
            if (error) {
                console.error('memcached set error', _key, error);
            }
        });
    };

    engine.get = function(_key, cb) {

        var key = safeKey(_key);

        memcached.get(key, function (error, data) {

            if (error) {
                console.error('memcached get error', _key, error);
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