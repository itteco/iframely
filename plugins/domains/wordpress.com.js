module.exports = {

    mixins: [
        "oembed-author",
        "oembed-site",
        "oembed-title",
        "oembed-thumbnail",
        "oembed-author",
        "favicon"
    ],

    getLink: function(oembed) {

        return {
            html: oembed.html,
            type: CONFIG.T.safe_html,
            rel: [CONFIG.R.reader, CONFIG.R.iframely]
        }
    },


    tests: [{
        feed: "http://en.wordpress.com/tag/technology/feed/"
    }, {
        skipMixins: [
            "oembed-thumbnail"
        ]
    }]
};