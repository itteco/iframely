module.exports = {

    re: /^https?:\/\/pinterest\.com\/pin\/(\d+)/i,

    mixins: [
        "og-title",
        "canonical",
        "og-description",
        "site",

        "og-image-rel-image",
        "twitter-image",
        "favicon"
    ],

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
    },
        "http://pinterest.com/pin/30258628719483308/"
    ]
};