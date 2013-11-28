module.exports = {

    re: [
        /^http:\/\/dribbble\.com\/shots\/([a-zA-Z0-9\-]+)/i
    ],

    mixins: [
        "favicon",
        "twitter-author",
        "canonical",
        "og-description",
        "og-site",
        "og-title"
    ],

    getLink: function(meta) {

        return {
            href: meta.og.image,
            type: CONFIG.T.image,
            rel: CONFIG.R.image,
            width: meta.twitter.image.width,
            height: meta.twitter.image.height
        };
    },

    tests: [ {
        page: "http://dribbble.com/",
        selector: ".dribbble-link"
    },
        "http://dribbble.com/shots/1311850-Winter-Is-Coming"
    ]
};
