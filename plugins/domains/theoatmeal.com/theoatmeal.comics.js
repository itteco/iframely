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

    getLink: function($selector) {

        var $comic = $selector('#comic');

        $comic.find('#content_footer2').remove();

        return {
            html: $comic.html(),
            type: CONFIG.T.safe_html,
            rel: [CONFIG.R.reader, CONFIG.R.inline]
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