module.exports = {

    mixins: [
        "og-title",
        "canonical",
        "og-site",
        "og-image",
        "video_src-responsive",
        "oembed-author",
    ],

    getLink: function () {

        return {            
            href: 'http://files.dipdive.com/favicon.ico',
            type: CONFIG.T.image,
            rel: CONFIG.R.icon
        }
    },

    tests: [{
        page: "http://dipdive.com/",
        selector: ".win_content:first h3 a"
    },
        "http://dippoetry.dipdive.com/media/151409"
    ]
};