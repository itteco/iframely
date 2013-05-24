var gUtils = require('./../../domains/flickr.com/utils');

module.exports = {

    // TODO: single image.

    re: /^https?:\/\/www\.flickr\.com\/photos\/([@a-zA-Z0-9_\.]+)\/sets\/(\d+)\/$/i,

    mixins: [
        "og-title"
    ],

    getData: function(urlMatch, request, cb) {

        var userId = urlMatch[1];

        gUtils.getSetPhotos(urlMatch[2], request, function(error, photos) {

            if (error) {
                return cb(error);
            }

            return {
                images: gUtils.mapGalleryImages(userId, photos)
            }
        });
    },

    tests: [{
        page: "http://www.flickr.com/photos/jup3nep/sets/",
        selector: ".Seta"
    },
        "http://www.flickr.com/photos/jup3nep/sets/72157603856136177/"
    ]
};