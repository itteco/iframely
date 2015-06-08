module.exports = {

    re: /^https?:\/\/angel\.co\/(?!jobs)([a-z0-9\-]+)/i,

    mixins: [
        "keywords",
        "favicon",
        "twitter-title",
        "twitter-image",
        "twitter-description",
        "canonical"
    ],

    getLink: function(urlMatch, twitter) {

        if (twitter.image) {
            return {
                template_context: {
                    title: twitter.title,
                    id: twitter.image.match(/\/\w+\/(\d+)-/)[1],
                    slug: urlMatch[1]
                },
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.inline, CONFIG.R.ssl],
                "max-width": 560 + 40 + 10,
                "min-height": 300 + 40 + 10
            }
        }

    },

    tests: [{
        page: "https://angel.co/",
        selector: ".name a"
    }]
};