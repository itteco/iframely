(function(engine) {

    var crypto = require('crypto');

    var Memcached = require('memcached');
    var memcached = new Memcached(CONFIG.MEMCACHED_OPTIONS && CONFIG.MEMCACHED_OPTIONS.locations);

    function safeKey(key) {
        return crypto.createHash('md5').update(key).digest("hex");
    }

    engine.set = function(key, data) {

        var key = safeKey(key);

        // Warning: value and lifetime argumets switched, bug in docs.
        memcached.set(key, JSON.stringify(data), CONFIG.CACHE_TTL, function(error){
            if (error) {
                console.error('memcached set error', error);
            }
        });
    };

    engine.get = function(key, cb) {

        var key = safeKey(key);

        memcached.get(key, function (error, data) {

            if (error) {
                console.error('memcached get error', error);
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