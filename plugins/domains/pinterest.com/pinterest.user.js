var DEFAULT_WIDTH = 600;

module.exports = {

    re: /^https?:\/\/(?:www\.)?pinterest\.com\/((?!pin)[a-zA-Z0-9%]+)\/?(?:$|\?|#)/i,

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "og-site",
        "og-title"
    ],    

    getLink: function(url, og, options) {

        if (og.type !== 'profile') {
            return;
        }

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.inline, CONFIG.R.ssl],
            template: "pinterest.widget",
            template_context: {
                url: url,
                title: "Pinterest User",
                type: "embedUser",
                width: options.maxWidth || DEFAULT_WIDTH,
                height: 600,
                pinWidth: 120
            },
            width: options.maxWidth || DEFAULT_WIDTH,
            height: 600+120
        };
    },

    tests: [{
        // No Test Feed here not to violate "scrapping" restrictions of Pinterest
        noFeeds: true
    },
        "http://pinterest.com/bcij/",
        "http://pinterest.com/franktofineart/"
    ]
};