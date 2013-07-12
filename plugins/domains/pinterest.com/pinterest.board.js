var jquery = require('jquery');

module.exports = {

    re: /^https?:\/\/pinterest\.com\/((?!pin)[a-z0-9]+)\/([\w\-]+)\/?(?:$|\?|#)/i,

    mixins: [
        "og-title",
        "og-description",
        "description",
        "canonical",
        "site",

        "favicon"
    ],

    getLink: function(meta, url) {
        return {
            type: CONFIG.T.text_html,
            rel: CONFIG.R.reader,
            template_context: {
                url: url,
                title: meta.og.title,
                width: 800,
                height: 600,
                pinWidth: 120
            },
            width: 800,
            height: 600+120
        };
    },

    tests: [
        "http://pinterest.com/bcij/pins/",
        "http://pinterest.com/bcij/aging-gracefully/",
        {
            noFeeds: true,
            skipMixins: [
                "og-description",
                "description"
            ]
        }
    ]
};