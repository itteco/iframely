var gUtils = require('./utils');
var async = require('async');

module.exports = {

    re: /^https?:\/\/www\.flickr\.com\/photos\/([@a-zA-Z0-9_\.]+)\/$/i,

    mixins: [
        "og-title"
    ],

    getData: function(urlMatch, request, cb) {

        var userId;

        async.waterfall([

            function(cb) {
                var username = urlMatch[1];
                if (username.indexOf("@") >= 0) {
                    cb(null, username);
                } else {
                    gUtils.getUserId(urlMatch[1], request, cb)
                }
            },

            function(_userId, cb) {
                userId = _userId;
                gUtils.getPublicPhotos(userId, request, cb);
            }

        ], function(error, photos) {

            if (error) {
                return cb(error);
            }

            return {
                images: gUtils.mapGalleryImages(userId, photos)
            }
        });
    },

    tests: [{
        feed: "http://api.flickr.com/services/feeds/photos_public.gne",
        getUrl: function(url) {
            var m = url.match(/^https?:\/\/www\.flickr\.com\/photos\/([@a-zA-Z0-9_\.]+)\//i);
            if (m) {
                return m[0];
            }
        }
    },
        "http://www.flickr.com/photos/jup3nep/"
    ]
};