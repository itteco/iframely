
module.exports = {

    re: /^https?:\/\/(?:www\.)?pinterest\.com\/pin\/(\d+)/i,

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "og-site",
        "og-title"
    ],

    getLink: function(url, og) {

        if (og.type !== 'pinterestapp:pin') {
            return;
        }

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.inline],
            template: "pinterest.widget",
            template_context: {
                url: url,
                title: "Pinterest Image",
                type: "embedPin",
                width: null,
                height: null,
                pinWidth: null
            },
            width: 250
        };
    },

    tests: [{
        // No Test Feed here not to violate "scrapping" restrictions of Pinterest
        noFeeds: true
    },
        "http://pinterest.com/pin/30258628719483308/"
    ]
};