export default {

    re: /^https?:\/\/www\.tmz\.com\/(?:videos|watch)\/([a-zA-Z0-9_]+)/,

    mixins: [
        "*"
    ],

    // It's here mostly for tests
    getLinks: function(schemaVideoObject) {

        var href = schemaVideoObject.embedURL || schemaVideoObject.embedUrl || schemaVideoObject.embedurl;

        if (href) {
            return {
                href: href,
                rel: CONFIG.R.player,
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