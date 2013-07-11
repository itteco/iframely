module.exports = {

    re: /^http:\/\/theoatmeal\.com\/comics\/[a-z0-9_-]+/i,

    mixins: [
        "image_src",
        "favicon"
    ],

    getMeta: function(meta) {
        return {
            title: meta["html-title"].replace(" - The Oatmeal", "")
        };
    },

    getData: function($selector) {

        var $comic = $selector('#comic');

        $comic.find('#content_footer2').remove();

        return {
            html_for_readability: $comic.html(),
            ignore_readability_error: true
        };
    },

    tests: [{
        page: "http://theoatmeal.com/comics",
        selector: "a.arrow_right"
    },
        "http://theoatmeal.com/comics/air_mattress"
    ]
};