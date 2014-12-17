module.exports = {

    re: /^http:\/\/theoatmeal\.com\/blog\/[a-z0-9_-]+/i,

    mixins: [
        "html-title",

        "image_src",
        "favicon"
    ],

    getLink: function(cheerio, readabilityEnabled) {

        var $body = cheerio('.post_body');
        var text = $body.text();

        return {
            html: $body.html(),
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