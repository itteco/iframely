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

        if (twitter.image && twitter.image.src) {
            return {
                template_context: {
                    title: twitter.title,
                    id: twitter.image.src.match(/\/i\/(\d+)-/)[1],
                    slug: urlMatch[1]
                },
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.inline],
                width: 560 + 40 + 10,
                height: 300 + 40 + 10
            }
        }

    },

    tests: [{
        page: "https://angel.co/",
        selector: ".name a"
    }]
};