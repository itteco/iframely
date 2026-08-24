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
        pageWithFeed: 'https://xkcd.com/',

        getUrl: function(url) {
            if (/^https?:\/\/[a-z0-9.-]+\/?$/i.test(url)) {
                // Skip domain like https://store.xkcd.com/
                return;
            }
            return url;
        }
    },
        {skipMixins: ["og-image-rel-image"]},
        "https://xkcd.com/1392/", // Large image present.
        "https://xkcd.com/731/",
        "https://www.xkcd.com/1709/",
        "https://xkcd.com/162/"
    ]
};