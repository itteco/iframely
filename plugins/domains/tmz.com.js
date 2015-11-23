module.exports = {

    re: /^https?:\/\/www\.tmz\.com\/videos\/([a-zA-Z0-9_]+)/,

    mixins: [
        "*"
    ],

    getLinks: function(meta) {

        var links = [];
        var aspect = 16 / 9;

        if (meta.stillurl || meta.thumburl) {
            links.push ({
                href: meta.stillurl || meta.thumburl,
                rel: CONFIG.R.thumbnail,
                type: CONFIG.T.image
            });
        }

        if (meta.videourl) {
            links.push ({
                href: meta.videourl,
                rel: CONFIG.R.player,
                type: CONFIG.T.maybe_text_html,
                "aspect-ratio": aspect
            });
        }

        return links;
    },

    tests: [
        "http://www.tmz.com/videos/0_nh3ix08r",
        "http://www.tmz.com/videos/0_qmzt0e8s/"
    ]
};