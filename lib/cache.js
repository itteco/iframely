    import * as _ from 'underscore';
    import CONFIG from '../config.js';

    var DEFAULT_CACHE = "node-cache";

    export const cache = {};

    async function setCachingEngine(path) {
        try {

            if (path.indexOf('/') === -1) {
                // Not full path.
                path = './cache-engines/' + path + '.js';
            }

            var id = path.split('/').slice(-1)[0].replace(/\.js$/, '');

            var cache_engine = await import(path);

            if (!cache_engine.set || !cache_engine.get) {
                console.warn("Default cache engine used. No get and set methods in cache engine", id);
                return await setCachingEngine(DEFAULT_CACHE);
            }

            cache.set = function(key, data, options) {
                var custom_ttl = options && options.ttl;
                if (custom_ttl !== 0) {
                    // Do not store with ttl === 0.
                    cache_engine.set(key, data, options);
                }
            };
            // TODO: do not get if ttl === 0 ?
            cache.get = cache_engine.get;

            if (cache_engine.getClient) {
                cache[id] = cache_engine.getClient();
            }

            console.log("Using cache engine:", id);

        } catch (ex) {
            if (path.indexOf(DEFAULT_CACHE) > -1) {
                throw ex;
            } else {
                console.warn("Default cache engine used. Check CONFIG.CACHE_ENGINE. ", ex.stack);
                await setCachingEngine(DEFAULT_CACHE);
            }
        }
    }

    await setCachingEngine(CONFIG.CACHE_ENGINE || DEFAULT_CACHE);

    cache.withCache = function(key, func, options, callback) {

        if (typeof options === 'function') {
            callback = options;
            options = null;
        }

        var cache_get, cache_set, cache_skip_set, cache_skip_get;

        if (options && options.multiCache) {
            cache_get = _.bind(options.multiCache.registerGetCb, options.multiCache);
            cache_set = _.bind(options.multiCache.registerSet, options.multiCache);
            cache_skip_get = _.bind(options.multiCache.skipGet, options.multiCache);
            cache_skip_set = _.bind(options.multiCache.skipSet, options.multiCache);
        } else {
            cache_get = cache.get;
            cache_set = cache.set;
        }

        var doNotWaitFunctionIfNoCache = options && options.doNotWaitFunctionIfNoCache;

        var exec = function() {

            if (doNotWaitFunctionIfNoCache) {
                callback(null, null);
            }

            func(function(error, data) {

                if (error) {

                    cache_skip_set && cache_skip_set();

                    if (doNotWaitFunctionIfNoCache) {
                        // Stop.
                        return;
                    }

                    callback(error);

                } else {

                    cache_set(key, data, options);

                    if (doNotWaitFunctionIfNoCache) {
                        // Stop.
                        return;
                    }

                    callback(error, data);
                }
            });
        };

        if (options && options.refresh) {

            cache_skip_get && cache_skip_get(key);

            exec();

        } else {

            cache_get(key, function(error, data) {

                if (!error && data) {

                    callback(null, data);

                } else {

                    exec();
                }
            });
        }
    };

    /*
    * Usage:
    *
    * var multi = new MultiCache({ttl:1});
    *
    * multi.registerGetCb('k1', cb1);
    * multi.registerGetCb('k2', cb2);
    * multi.skipGet('k3');
    *
    * multi.runAllGets();
    *
    * multi.registerSet('k1', 'data1');
    * multi.registerSet('k2', 'data1');
    * multi.skipSet('k3');
    *
    * */

    const MultiCache = cache.MultiCache = function(options) {
        this.options = options;

        this.keysDict = {};
        this.setKeysDict = {};

        this.getCbDict = {};
        this.setDict = {};

        this.setDone = false;
    };

    // Get.

    MultiCache.prototype.registerGetCb = function(key, cb) {

        if (this.multiKey) {
            throw new Error('registerGetCb must run before runAllGets');
        }

        if (!this.keysDict[key]) {
            this.getCbDict[key] = [];
            this.keysDict[key] = true;
        }
        this.getCbDict[key].push(cb);
    };

    MultiCache.prototype.skipGet = function(key) {

        if (this.multiKey) {
            throw new Error('skipGet must run before runAllGets');
        }

        if (!this.keysDict[key]) {
            this.keysDict[key] = true;
        }
    };

    MultiCache.prototype.runAllGets = function() {

        var that = this;

        var getsCount = _.keys(this.getCbDict).length;

        var keysList = _.keys(this.keysDict).sort();
        this.multiKey = keysList.join(':');
        if (keysList.length > 1) {
            this.multiKey = 'multi:' + this.multiKey;
        } else if (keysList.length === 1) {
            this.singleKey = keysList[0];
        }

        if (getsCount > 0) {

            cache.get(this.multiKey, function(error, data) {
                for(var key in that.getCbDict) {

                    var value;

                    if (that.singleKey) {
                        if (data && typeof data === 'object' && key in data) {
                            // Support old cached data.
                            value = data[key];
                        } else {
                            value = data;
                        }
                    } else {
                        value = data && data[key];
                    }

                    var cbs = that.getCbDict[key];
                    if (cbs && cbs.length) {
                        for(var i = 0; i < cbs.length; i++) {
                            cbs[i](error, value);
                        }
                    }
                }
            });

        } else {

            this._checkAllSet();
        }
    };

    // Set.

    MultiCache.prototype.registerSet = function(key, value, options) {

        if (!this.options && options) {
            this.options = options;
        }

        this._registerSetKey(key);
        this.setDict[key] = value;
        this._checkAllSet();
    };

    MultiCache.prototype.skipSet = function(key) {
        this._registerSetKey(key);
        this._checkAllSet();
    };

    MultiCache.prototype._registerSetKey = function(key) {

        if (key in this.keysDict) {

            if (key in this.setKeysDict) {
                throw new Error('set key used twice');
            }

            this.setKeysDict[key] = true;

        } else {

            throw new Error('set key not used with registerGetCb or skipSet');
        }
    };

    MultiCache.prototype._checkAllSet = function() {
        if (_.keys(this.keysDict).length === _.keys(this.setKeysDict).length && this.multiKey) {
            this._runAllSets();
        }
    };

    MultiCache.prototype._runAllSets = function() {

        if (!this.multiKey) {
            throw new Error('runAllGets must run before _runAllSets');
        }

        if (this.setDone) {
            throw new Error('_runAllSets called twice');
        }

        this.setDone = true;

        var data = this.setDict;
        if (this.singleKey) {
            data =this.setDict[this.singleKey];
        }

        cache.set(this.multiKey, data, this.options);
    };