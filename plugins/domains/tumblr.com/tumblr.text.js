var $ = require('cheerio');

module.exports = {

    re: require('./tumblr.api').re,

    getMeta: function (tumblr_post) {
        if (tumblr_post.type == "text") {
            return {
                media: 'reader'
            };
        }
    },


    getLink: function (tumblr_post) {
        if (tumblr_post.thumbnail_url || tumblr_post.type !== "text") {
            return;
        }

        var $post = $('<div>').html(tumblr_post.body);
        var $image = $post.find('img').first(); // Could be more than 1 image, true. But the response time will be unacceptable as post-processing will check all image sizes.

        if ($image ) {
            return {
                href: $image.attr('src'),
                title: $image.attr('alt'),
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
            };
        }
    },

    tests: [{skipMethods: ["getData"]},
        "http://blog.slides.com/post/84828911898/slides-turns-one-year-old"
    ]
};