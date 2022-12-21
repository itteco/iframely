export default {

    re: /^https?:\/\/(?:www.)?xkcd\.com\/\d+/i,

    mixins: ["*", "og-image-rel-image"],

    provides: ['xkcd'],

    getMeta: function(xkcd) {
        return {
            description: xkcd.title
        }
    },

    getLink: function(xkcd) {
        if (xkcd.src) {
            return {
                href: xkcd.src,
                type: CONFIG.T.image,
                rel: CONFIG.R.image
            }
        }
    },

    getData: function(url, cheerio) {
        var $img = cheerio("#comic img");
        if ($img.length === 1) {
            return {
                xkcd: {
                    src: $img.attr('src'),
                    title: $img.attr('title')
                }
            }
        }

    },

    tests: [{
        pageWithFeed: 'http://xkcd.com/'
    },
        "http://xkcd.com/1392/", // Large image present.
        "http://xkcd.com/731/",
        "http://www.xkcd.com/1709/",
        "https://xkcd.com/162/"
    ]
};