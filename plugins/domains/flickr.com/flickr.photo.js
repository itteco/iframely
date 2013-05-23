var gUtils = require('./utils');

module.exports = {

    re: /^https?:\/\/www\.flickr\.com\/photos\/[@a-zA-Z0-9_\.]+\/(\d+).*?$/i,

    mixins: [
        "og-title",
        "oembed-license"
    ],

    getLink: function(urlMatch, request, cb) {

        gUtils.getPhotoSizes(urlMatch[1], request, function(error, sizes) {

            if (error) {
                return cb(error);
            }

            cb(null, sizes && sizes.map(function(size) {
                return {
                    href: size.source,
                    width: size.width,
                    height: size.height,
                    type: "image/jpeg",
                    rel: CONFIG.R.image
                };
            }));
        });
    },

    tests: [{
        feed: "http://api.flickr.com/services/feeds/photos_public.gne"
    },
        "http://www.flickr.com/photos/jup3nep/8243797061/?f=hp"
        ]
};