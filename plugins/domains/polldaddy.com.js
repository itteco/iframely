module.exports = {

    re: [
        /^https?:\/\/polldaddy\.com\/poll\/([0-9]+)/i
    ],

    mixins: [
        "oembed-title",
        "oembed-site"
    ],

    getLink: function(oembed) {

        return [{
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.survey, CONFIG.R.ssl, CONFIG.R.html5],
            html: oembed.html.replace(/src=\"http:\/\/static\.polldaddy\.com/, "src=\"https://secure.polldaddy.com"),
            "min-width": 332
        }, {
            type: CONFIG.T.image,
            rel: CONFIG.R.icon, 
            href: "https://polldaddy.com/favicon.ico"
        }, {
            type: CONFIG.T.image,
            rel: CONFIG.R.thumbnail,
            href: "http://polldaddy.com/images/pd-swirl.png"
        }];
    },

    tests: [
        "https://polldaddy.com/poll/7451882/?s=twitter",
        "http://polldaddy.com/poll/9113163/"
    ]
};