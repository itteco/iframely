var gUtils = require('./utils');

module.exports = {

    re: /^https?:\/\/www\.flickr\.com\/photos\/([@a-zA-Z0-9_\.-]+)\/(\d+).*?$/i,

    mixins: [
        "oembed-title",
        "oembed-author",
        "oembed-license",
        "oembed-site"
    ],

    getLink: function(urlMatch, request, options, cb) {
        gUtils.getPhotoSizes(urlMatch[2], request, options.getProviderOptions('flickr.apiKey'), function(error, sizes) {

            if (error) {
                return cb(error);
            }

            var result = sizes && sizes.map(function(size, idx) {

                if (size.media == "photo") {

                    return {
                        href: size.source.replace(/^https?:/i, ""),
                        width: size.width,
                        height: size.height,
                        type: CONFIG.T.image_jpeg,
                        rel: size.width >= 800 || (idx === sizes.length - 1) ? CONFIG.R.image : CONFIG.R.thumbnail
                    };

                } else if (size.media == "video") {

                    return {
                        href: size.source,
                        "aspect-ratio": size.width / size.height,
                        type: /mp4/i.test(size.label) ? CONFIG.T.video_mp4 : CONFIG.T.flash,
                        rel: CONFIG.R.player
                    };
                }
            }) || [];

            var last = sizes[sizes.length - 1];

            var media_only = options.getProviderOptions('flickr.media_only', false);

            if (!media_only) {
                result.splice(0, 0, {
                    href: 'https://www.flickr.com/photos/' + urlMatch[1] + '/' + urlMatch[2] + '/player',
                    rel: [CONFIG.R.image, CONFIG.R.player, CONFIG.R.html5],
                    type: CONFIG.T.text_html,
                    "aspect-ratio": last.width / last.height
                });
            }

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