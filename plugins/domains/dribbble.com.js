module.exports = {

    re: [
        /^https?:\/\/dribbble\.com\/shots\/([a-zA-Z0-9\-]+)/i,
        /^https?:\/\/dribbble\.com\/([a-zA-Z0-9\-]+)(?:\?[^\/]+)?$/i
    ],

    // required to bypass canonical=gif for gif shots
    mixins: [
        "favicon",
        "og-description",
        "twitter-labels",
        "og-site",
        "theme-color",
        "og-title"
    ],

    getLink: function(meta, urlMatch, cb) {

        if (meta.og && meta.og.image) {

            cb(null, {
                href: meta.og.image.url || meta.og.image,
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
        "http://dribbble.com/shots/1311850-Winter-Is-Coming",
        "http://dribbble.com/shots/5030547-Chairs-Store-App"
    ]
};
