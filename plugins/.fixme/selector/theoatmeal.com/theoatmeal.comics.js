var re = /^http:\/\/theoatmeal\.com\/comics\/[a-z0-9_-]+/i;

module.exports = {

    notPlugin:  !(CONFIG.providerOptions.readability && CONFIG.providerOptions.readability.enabled === true),

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

    getLink: function(cheerio) {

        var $comic = cheerio('#comic');

        $comic.find('#content_footer2').remove();

        return {
            html: $comic.html(),
            type: CONFIG.T.text_html,
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