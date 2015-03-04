module.exports = {

    re: [
        /^https?:\/\/tv\.zing\.vn\/video\/[a-zA-Z0-9\-]+\/([a-zA-Z0-9]+)\.html/i
    ],

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "keywords",
        "og-site",
        "og-title"
    ],

    getLink: function(urlMatch) {

        return {
            href: "//tv.zing.vn/embed/video/" + urlMatch[1],
            rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.ssl],
            type: CONFIG.T.text_html,
            "aspect-ratio": 640 / 360
        }
    },

    tests: [ 
        "http://tv.zing.vn/video/Tran-Thanh-Di-Cho-Tot-Tap-3-Tran-Thanh-Mua-Xe/IWZ9DCAU.html"
    ]
};