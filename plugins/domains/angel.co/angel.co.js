module.exports = {

    re: /^https:\/\/angel\.co\/([a-z-]+)/i,

    mixins: [
        "twitter-title",
        "canonical",
        "twitter-description",
        "keywords",

        "og-image",
        "twitter-image",
        "favicon"
    ],

    getLink: function(urlMatch, meta) {
        return {
            template_context: {
                title: meta.twitter.title,
                id: meta.og.image.match(/\/i\/(\d+)-/)[1],
                slug: urlMatch[1]
            },
            type: CONFIG.T.text_html,
            rel: CONFIG.R.reader,
            width: 560 + 40 + 10,
            height: 300 + 40 + 10
        }
    },

    tests: [{
        page: "https://angel.co/",
        selector: ".name a"
    },
        "https://angel.co/gumroad/jobs"
    ]
};