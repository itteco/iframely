var jquery = require('jquery');

module.exports = {

    re: /^https?:\/\/pinterest\.com\/((?!pin)[a-z0-9]+)\/?(?:$|\?|#)/i,

    mixins: [
        "og-title",
        "og-description",
        "canonical",
        "site",

        "favicon"
    ],

    getLink: function(meta, url) {
        return {
            type: CONFIG.T.text_html,
            rel: CONFIG.R.reader,
            template: "pinterest.widget",
            template_context: {
                url: url,
                title: meta.og.title,
                type: "embedUser",
                width: 800,
                height: 600,
                pinWidth: 120
            },
            width: 800,
            height: 600+120
        };
    },

    tests: [{
        page: "http://pinterest.com/all/science_nature/",
        selector: ".pinUserAttribution a.firstAttribution"
    },
        "http://pinterest.com/bcij/",
        "http://pinterest.com/franktofineart/"
    ]
};