module.exports = {

    re: [
        /^https?:\/\/www\.viddler\.com\/v\/([a-z0-9\-]+)/i
    ],

    mixins: [
        "oembed-title",
        "oembed-author",
        "oembed-site",
        "oembed-thumbnail",
        "oembed-video-responsive"
    ],

    getLink: function () {

        return {
            href: "http://www.viddler.com/favicon.ico?v=245",
            rel: CONFIG.R.icon,
            type: CONFIG.T.image
        }
    },

    tests: [
        "http://www.viddler.com/v/5b70e34a"
    ]
};