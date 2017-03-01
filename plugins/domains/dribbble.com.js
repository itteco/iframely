module.exports = {

    re: [
        /^https?:\/\/dribbble\.com\/shots\/([a-zA-Z0-9\-]+)/i,
        /^https?:\/\/dribbble\.com\/([a-zA-Z0-9\-]+)(?:\?[^\/]+)?$/i
    ],

    mixins: ["*"],

    getLink: function(meta, urlMatch, cb) {

        if (meta.og && meta.og.image) {

            cb(null, {
                href: meta.og.image,
                type: CONFIG.T.image,
                rel: meta.og.type === 'profile'? [CONFIG.R.image, CONFIG.R.promo] : CONFIG.R.image,
                width: meta.twitter.image.width,
                height: meta.twitter.image.height
            });

        } else {
            // Attachments pages doesn't have any meta at the moment :\
            cb ({
                redirect: urlMatch[0] + urlMatch[1]
            });

        }
    },

    tests: [ {
        page: "http://dribbble.com/",
        selector: ".dribbble-link"
    }, {
        skipMixins: [
            "twitter-author",
            "og-description"
        ]
    },
        "http://dribbble.com/shots/1311850-Winter-Is-Coming"
    ]
};
