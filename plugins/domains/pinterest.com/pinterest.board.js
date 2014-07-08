
module.exports = {

    re: /^https?:\/\/(?:www\.)?pinterest\.com\/((?!pin)[a-z0-9]+)\/([\w\-]+)\/?(?:$|\?|#)/i,

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "og-site",
        "og-title"
    ],    

    getLink: function(url, og) {

        if (og.type !== 'pinterestapp:pinboard') {
            return;
        }

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.inline],
            template: "pinterest.widget",
            template_context: {
                url: url,
                title: "Pinterest Board",
                type: "embedBoard",
                width: 600,
                height: 600,
                pinWidth: 120
            },
            width: 600,
            height: 600+120
        };
    },

    tests: [{
        // No Test Feed here not to violate "scrapping" restrictions of Pinterest
        noFeeds: true
    },
        "http://pinterest.com/bcij/art-mosaics/",
        "http://pinterest.com/bcij/aging-gracefully/"
    ]
};