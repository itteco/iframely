module.exports = {

    re: /^http:\/\/theoatmeal\.com\/blog\/[a-z0-9_-]+/i,

    mixins: [
        "html-title",

        "image_src",
        "favicon"
    ],

    getData: function($selector) {
        return {
            readability_data: {
                html: $selector('.post_body').html()
            }
        };
    },

    tests: [{
        page: "http://theoatmeal.com/blog",
        selector: "a.arrow_right"
    },
        "http://theoatmeal.com/blog/fathers_day2013"
    ]
};