import log from '../../logging.js';
import * as crypto from 'crypto';
import Memcached from 'memcached';
import CONFIG from '../../config.loader.js';

var memcached = new Memcached(CONFIG.MEMCACHED_OPTIONS && CONFIG.MEMCACHED_OPTIONS.locations, CONFIG.MEMCACHED_OPTIONS && CONFIG.MEMCACHED_OPTIONS.options);

var timeout = CONFIG.MEMCACHED_OPTIONS && CONFIG.MEMCACHED_OPTIONS.options && CONFIG.MEMCACHED_OPTIONS.options.timeout;

var MEMCACHED_MAX_DATA_SIZE = 1024 * 1024;  // Megabyte.

function safeKey(key) {
    return crypto.createHash('md5').update(key).digest("hex");
}

function _findKeyMeta(k) {


    var sk = safeKey(k);

    memcached.items(function(a, b){

        var stubs = Object.keys(b[0]);

        stubs.forEach(function(sid) {

            var servers = CONFIG.MEMCACHED_OPTIONS.locations;
            if (servers instanceof Object) {
                servers = Object.keys(servers);
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

export function set(_key, data, options) {

    var key = (!options || !options.raw) ? safeKey(_key) : _key;

    //console.log(key, (!options || !options.raw) ? JSON.stringify(data) : data);

    // Warning: value and lifetime argumets switched, bug in docs.
    // Warning: need replace /n if raw saved. Memcached in nginx read bug.
    var storedData = (!options || !options.raw) ? JSON.stringify(data) : data.replace(/\n/g, '');

    if (storedData && storedData.length > MEMCACHED_MAX_DATA_SIZE) {

        log('   -- Memcached handled set error ' + _key + ': The length of the value is ' + storedData.length + ' and greater than ' + MEMCACHED_MAX_DATA_SIZE);

    } else {

        memcached.set(key, storedData, options && options.ttl || CONFIG.CACHE_TTL, function(error){
            if (error) {
                log('   -- Memcached set error ' + _key + ' ' + error);
            }
        });
    }
};

export function get(_key, cb) {

    var key = safeKey(_key);

    var timeoutId, finished = false;

    if (timeout) {
        setTimeout(function() {
            if (finished) {
                return;
            }
            finished = true;
            log('   -- Memcached soft timeout on get ' + _key);
            cb(null, null);
        }, timeout);
    }

    memcached.get(key, function (error, data) {

        if (finished) {
            return;
        }
        finished = true;

        clearTimeout(timeoutId);

        if (error) {
            log('   -- Memcached get error ' + _key + ' ' + error);
            // Fail silent.
            return cb(null, null);
        }

        if (typeof data !== 'string') {
            return cb(null, data);
        }

        try {
            var parsedData = JSON.parse(data);
        } catch(ex) {
            log('   -- Memcached: error JSON parse value ' + _key + ' ' + ex.message);
            return cb(null, null);
        }

        if (parsedData && typeof parsedData === 'object' && _key in parsedData) {
            // Support old multi cached data.
            parsedData = parsedData[_key];
        }

        cb(null, parsedData);
    });
};

export function getClient() {
    return memcached;
};
