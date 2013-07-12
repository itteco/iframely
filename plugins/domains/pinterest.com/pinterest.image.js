module.exports = {

    re: /^https?:\/\/pinterest\.com\/pin\/(\d+)/i,

    mixins: [
        "og-title",
        "canonical",
        "description",
        "site",

        "og-image-rel-image",
        "twitter-image",
        "favicon"
    ],

    getMeta: function($selector) {
        return {
            description: $selector('.commentDescriptionContent').text()
        };
    },

    getLink: function(url, meta) {
        return {
            type: CONFIG.T.text_html,
            rel: CONFIG.R.reader,
            template: "pinterest.widget",
            template_context: {
                url: url,
                title: meta.og.title,
                type: "embedPin",
                width: null,
                height: null,
                pinWidth: null
            },
            width: 250
        };
    },

    tests: [{
        page: "http://pinterest.com/all/science_nature/",
        selector: ".pinImageWrapper"
    }]
};