module.exports = {

    re: /^http:\/\/theoatmeal\.com\/blog\/[a-z0-9_-]+/i,

    mixins: [
        "html-title",

        "image_src",
        "favicon"
    ],

    getData: function($selector) {
        return {
            html_for_readability: $selector('.post_body').html(),
            ignore_readability_error: true
        };
    },

    tests: [{
        page: "http://theoatmeal.com/blog",
        selector: "a.arrow_right"
    },
        "http://theoatmeal.com/blog/fathers_day2013"
    ]
};