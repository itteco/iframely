module.exports = {

    re: [
        /^https?:\/\/polldaddy\.com\/poll\/([0-9]+)/i
    ],

    mixins: [
        "twitter-image",
        "domain-icon",
        "canonical",
        "twitter-description",
        "oembed-site",
        "twitter-title"
    ],

    getLink: function(oembed) {

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.survey, CONFIG.R.ssl, CONFIG.R.html5],
            html: oembed.html.replace(/src=\"http:\/\/static\.polldaddy\.com/, "src=\"https://secure.polldaddy.com"),
            "min-width": 332
        };
    },

    tests: [
        "https://polldaddy.com/poll/7451882/?s=twitter",
        "http://polldaddy.com/poll/9113163/"
    ]
};