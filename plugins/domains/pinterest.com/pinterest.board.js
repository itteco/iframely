var DEFAULT_WIDTH = 600;

module.exports = {

    re: /^https?:\/\/(?:www\.)?pinterest\.com\/((?!pin)[a-zA-Z0-9%]+)\/([a-zA-Z0-9%\-]+)\/?(?:$|\?|#)/i,

    mixins: [
        "favicon",
        "canonical",
        "description",
        "og-site",
        "html-title"
    ],

    getLink: function(url, twitter, options) {

        if (twitter.app && twitter.app.iphone && twitter.app.iphone.indexOf('board/') == -1) {
            return;
        }

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.inline, CONFIG.R.ssl],
            template: "pinterest.widget",
            template_context: {
                url: url,
                title: "Pinterest Board",
                type: "embedBoard",
                width: options.maxWidth || DEFAULT_WIDTH,
                height: 600,
                pinWidth: 120
            },
            width: options.maxWidth || DEFAULT_WIDTH,
            height: 600 + 120
        };
    },

    tests: [{
        // No Test Feed here not to violate "scrapping" restrictions of Pinterest
        noFeeds: true
    },
        "http://pinterest.com/bcij/art-mosaics/",
        "http://pinterest.com/bcij/aging-gracefully/",
        "https://www.pinterest.com/mimimememe/office-humor-work-jokes/"
    ]
};