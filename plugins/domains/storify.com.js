module.exports = {

    re: [
        /^https?:\/\/storify\.com(?:\/[0-9a-z\-]+){2}$/i
    ],

    mixins: [
        "og-title",
        "og-site",
        "favicon"
    ],

    getMeta: function(meta) {

        if (meta.storifyapp) return {
            "author-url": meta.storifyapp.author
        }
    },

    getLink: function(meta) {

        return [{
            href: meta.canonical.replace('http:', '') + '.js',
            type: CONFIG.T.javascript,
            rel: CONFIG.R.reader,
            "orientation": 'portrait',
            "min-width": 320
        }]
    },

    tests: [{
        feed: "http://storify.com/rss/featured"
    },
        "https://storify.com/miniver/our-leaders-willfully-wrong-response-to-the-econom/"
    ]
};