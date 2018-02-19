module.exports = {

    re: [
        /^https?:\/\/(?:\w+\.)?polldaddy\.com\/poll\/([0-9]+)/i,
        /^https?:\/\/(?:\w+\.)?polldaddy\.com\/s\//i
    ],

    mixins: [
        "twitter-image",
        "domain-icon",
        "canonical",
        "twitter-description",
        "oembed-site",
        "twitter-title",
        "og-description",
        "og-title"

    ],

    getLink: function(oembed, url) {

        return {
            type: CONFIG.T.text_html,
            rel: /^https?:\/\/(?:\w+\.)?polldaddy\.com\/s\//i.test(url) ? [CONFIG.R.survey, CONFIG.R.inline, CONFIG.R.ssl, CONFIG.R.html5] : [CONFIG.R.survey, CONFIG.R.ssl, CONFIG.R.html5],
            html: oembed.html.replace(/src=\"http:\/\/static\.polldaddy\.com/, "src=\"https://secure.polldaddy.com"),
            "min-width": 332
        };
    },

    tests: [
        {
            skipMixins: [
                "twitter-image",
                "canonical",
                "twitter-description",
                "oembed-site",
                "twitter-title",
                "og-description",
                "og-title"
            ]
        },
        "https://polldaddy.com/poll/7451882/?s=twitter",
        "http://polldaddy.com/poll/9113163/"
    ]
};