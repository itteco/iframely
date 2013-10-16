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
            rel: CONFIG.R.survey,
            template: "embed-html",
            template_context: {
                title: oembed.title,
                html: oembed.html
            },
            "min-width": 332
        }, {
            type: CONFIG.T.image,
            rel: CONFIG.R.icon, 
            href: "https://polldaddy.com/favicon.ico"
        }];
    },

    tests: [
        "https://polldaddy.com/poll/7451882/?s=twitter"
    ]
};