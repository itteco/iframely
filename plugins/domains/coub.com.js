module.exports = {

    mixins: [
        "oembed-title",
        "oembed-thumbnail",
        "oembed-author",
        "oembed-site",
        "oembed-video-responsive"
    ],

    getLink: function () {

        return {
            href: "http://coub.com/favicon.ico",
            rel: CONFIG.R.icon,
            type: CONFIG.T.image
        }
    },

    tests: [ 
        "http://coub.com/view/12yjcjny",
    ]
};