var async = require('async');
var cache = require('../../../cache');
var sysUtils = require('../../../../utils');

module.exports = {

    provides: ['__noCachedNonHtmlContentData', 'nonHtmlContentData'],

    getData: function(url, cb) {

        var nonHtmlContentData_key = 'nhcd:' + url;

        async.waterfall([

            function(cb) {
                cache.get(nonHtmlContentData_key, cb);
            },

            function(data, cb) {

                if (data) {

                    // Too much logs.
                    //sysUtils.log('   -- Using cached content type for: ' + url);

                    cb(null, {
                        nonHtmlContentData: data
                    });

                } else {

                    cb(null, {
                        __noCachedNonHtmlContentData: true
                    });
                }
            }

        ], function(error, data) {

            if (error) {

                sysUtils.log('   -- Error loading cached content type for: ' + url + '. ' + error);

                cb(null, {
                    __noCachedNonHtmlContentData: true
                });

            } else {

                cb(error, data);
            }
        });
    }

};