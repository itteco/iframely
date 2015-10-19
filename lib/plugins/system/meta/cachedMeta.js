var async = require('async');
var cache = require('../../../cache');
var sysUtils = require('../../../../logging');

module.exports = {

    provides: ['__noCachedMeta', 'meta'],

    getData: function(url, cb) {

        var meta_key = 'meta:' + url;

        async.waterfall([

            function(cb) {
                cache.get(meta_key, cb);
            },

            function(data, cb) {

                if (data) {

                    sysUtils.log('   -- Using cached meta for: ' + url);

                    cb(null, {
                        meta: data
                    });

                } else {

                    cb(null, {
                        __noCachedMeta: true
                    });
                }
            }

        ], function(error, data) {

            if (error) {

                sysUtils.log('   -- Error loading cached meta for: ' + url + '. ' + error);

                cb(null, {
                    __noCachedMeta: true
                });

            } else {

                cb(error, data);
            }
        });
    }

};