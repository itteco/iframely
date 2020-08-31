module.exports = {

    re: /^https?:\/\/www\.tmz\.com\/videos\/([a-zA-Z0-9_]+)/,

    mixins: [
        "*"
    ],

    getLinks: function(schemaVideoObject) {

        var href = schemaVideoObject.embedURL || schemaVideoObject.embedUrl || schemaVideoObject.embedurl;

        if (href) {
            return {
                href: href,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                type: CONFIG.T.text_html,
                "aspect-ratio": 16/9,
                "padding-bottom": 10
            };
        }
    },

    tests: [
        "https://www.tmz.com/videos/0-nh3ix08r/",
        "https://www.tmz.com/videos/0-qmzt0e8s/"
    ]
};