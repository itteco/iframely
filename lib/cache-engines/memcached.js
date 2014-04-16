(function(engine) {

    var crypto = require('crypto');

    var Memcached = require('memcached');
    var memcached = new Memcached(CONFIG.MEMCACHED_OPTIONS && CONFIG.MEMCACHED_OPTIONS.locations);

    function safeKey(key) {
        return crypto.createHash('md5').update(key).digest("hex");
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