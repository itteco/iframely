import { decodeHTML5 } from 'entities';

export default {

    re: /^https?:\/\/(?:www.)?xkcd\.com\/\d+/i,

    mixins: ["*"],

    provides: 'xkcd_data',

    getData: function(cheerio, decode) {

        var $img = cheerio('#comic img');
        var $a = cheerio('#comic a');

        return {
            xkcd_data: {
                image: $img.attr('src'),
                has_large_image: $a.length,
                description: decodeHTML5(decode($img.attr('title')))
            }
        };
    },

    getMeta: function(xkcd_data) {
        return {
            description: xkcd_data.description
        };
    },

    getLinks: function(xkcd_data) {

        var result = [{
            href: xkcd_data.image,
            type: CONFIG.T.image_png,
            rel: [CONFIG.R.image, CONFIG.R.thumbnail]
        }];

        if (xkcd_data.has_large_image) {
            result.push({
                href: xkcd_data.image.replace('.png', '_large.png'),
                type: CONFIG.T.image_png,
                rel: CONFIG.R.image
            });
        }

        return result;
    },

    tests: [{
        pageWithFeed: 'http://xkcd.com/'
    },
        "http://xkcd.com/1392/", // Large image present.
        "http://xkcd.com/731/",
        "http://www.xkcd.com/1709/"
    ]
};