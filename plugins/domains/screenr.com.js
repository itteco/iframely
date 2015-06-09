module.exports = {

    mixins: [
        "oembed-title",
        "oembed-thumbnail",
        "oembed-author",
        "oembed-site",
        "oembed-video-responsive-nonhtml5"
    ],

    getLinks: function(oembed) {
        return {
            href: "http://www.screenr.com/public/images/apple-touch-icon.png",
            rel: CONFIG.R.icon,
            type: CONFIG.T.image
        };
    },

    tests: [ {
        pageWithFeed: "http://www.screenr.com/stream"
    },
        "http://www.screenr.com/e4HH"
    ]
};