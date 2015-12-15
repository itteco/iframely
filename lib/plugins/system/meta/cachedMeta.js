var async = require('async');
var cache = require('../../../cache');
var sysUtils = require('../../../../logging');

module.exports = {

    provides: ['__noCachedMeta', 'meta'],

    getData: function(url, cb) {

        var meta_key = 'meta:' + url;

        cache.get(meta_key, function(error, data) {

            if (error) {
                sysUtils.log('   -- Error loading cached meta for: ' + url + '. ' + error);
            }

            if (!error && data) {

                sysUtils.log('   -- Using cached meta for: ' + url);

                cb(error, {
                    meta: data
                });

            } else {

                cb(null, {
                    __noCachedMeta: true
                });
            }
        });
    }

};