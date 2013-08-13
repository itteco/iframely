var re = /^http:\/\/theoatmeal\.com\/comics\/[a-z0-9_-]+/i;

module.exports = {

    re: re,

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
            readability_data: {
                html: $comic.html()
            }
        };
    },

    tests: [{
        page: "http://theoatmeal.com/comics",
        selector: "a.arrow_right",
        getUrl: function(url) {
            if (url.match(re)) {
                return url;
            }
        }
    },
        "http://theoatmeal.com/comics/air_mattress"
    ]
};