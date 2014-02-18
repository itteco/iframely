module.exports = {

    re: /^http:\/\/theoatmeal\.com\/blog\/[a-z0-9_-]+/i,

    mixins: [
        "html-title",

        "image_src",
        "favicon"
    ],

    provides: 'theoatmeal_body',

    getData: function($selector) {

        var $body = $selector('.post_body');
        var text = $body.text();

        if ($selector.trim(text)) {
            return {
                readability_data: {
                    html: $body.html()
                }
            };
        } else {
            return {
                theoatmeal_body: $body.html()
            };
        }
    },

    // TODO: make generic plugin?
    getLink: function(theoatmeal_body) {
        return {
            html: theoatmeal_body,
            type: CONFIG.T.safe_html,
            rel: [CONFIG.R.reader, CONFIG.R.inline]
        };
    },

    tests: [{
        page: "http://theoatmeal.com/blog",
        selector: "a.arrow_right"
    },
        "http://theoatmeal.com/blog/fathers_day2013",
        {
            skipMethods: ["getLink"]
        }
    ]
};