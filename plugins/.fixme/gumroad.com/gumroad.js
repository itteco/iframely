module.exports = {

    re: /^https:\/\/gumroad\.com\/l\/(\w+)/i,

    mixins: [
        "og-image",
        "favicon",
        "twitter-author",
        "canonical",
        "twitter-description",
        "og-site",
        "twitter-title"
    ],

    getLink: function(urlMatch) {

        return {
            template_context: {
                id: urlMatch[1]
            },
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl],
            'max-width': 676
        };
    },

    tests: [
        "https://gumroad.com/l/NlhpD"
    ]
};