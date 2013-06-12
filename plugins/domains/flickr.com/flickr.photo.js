var gUtils = require('./utils');

module.exports = {

    re: /^https?:\/\/www\.flickr\.com\/photos\/[@a-zA-Z0-9_\.-]+\/(\d+).*?$/i,

    mixins: [
        "oembed-title",
        "oembed-author",
        "oembed-license",
        "oembed-site"
    ],

    getLink: function(urlMatch, request, cb) {

        gUtils.getPhotoSizes(urlMatch[1], request, function(error, sizes) {

            if (error) {
                return cb(error);
            }

            var result = sizes && sizes.map(function(size) {
                return {
                    href: size.source.replace(/^https?:/i, ""),
                    width: size.width,
                    height: size.height,
                    type: "image/jpeg",
                    rel: size.width > 500 ? CONFIG.R.image : CONFIG.R.thumbnail
                };
            }) || [];

            result.push({
                href: "http://l.yimg.com/g/favicon.ico",
                rel: CONFIG.R.icon,
                type: CONFIG.T.image_icon
            });

            cb(null, result);
        });
    },

    tests: [{
        feed: "http://api.flickr.com/services/feeds/photos_public.gne"
    },
        "http://www.flickr.com/photos/jup3nep/8243797061/?f=hp",
        {
            skipMixins: [
                "oembed-title",
                "oembed-author",
                "oembed-license"
            ]
        }
    ]
};