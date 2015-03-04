var $ = require('cheerio');

module.exports = {

    re: [
        /^https?:\/\/([a-z0-9-]+\.tumblr\.com)\/(post|image)\/(\d+)(?:\/[a-z0-9-]+)?/i,
        /^https?:\/\/([a-z-\.]+)\/(post|post)\/(\d{11})(?:\/[a-z0-9-]+)?/i
    ],

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
        var $images = $post.find('img');

        if ($images.length ) {
                        // Could be more than 1 image, true. 
            return {    // But the response time will be unacceptable as post-processing will check alll image sizes.
                href: $images.attr('src'),
                title: $images.attr('alt'),
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
            };
        }
    },

    getData: function (tumblr_post, __readabilityEnabled) {

        if (tumblr_post.type !== "text") {

            var caption = $('<div>').html(tumblr_post.caption).text();
            if (!caption || caption.length < 160) {
                return;
            }
        }

        return {
            safe_html: tumblr_post.body || tumblr_post.caption
        };
    },

    tests: [
        "http://asimpleweirdlass.tumblr.com/post/58054585454/nakakatakot-kanina-ang-dilim-sa-street-tapos",
        "http://soupsoup.tumblr.com/post/41952443284/think-of-yourself-less-of-a-journalist-and-more",
        "http://pin.it/gotOeRU",
        "http://blog.path.com/post/76550009909/stickers-xoxo-and-valentines",
        "http://blog.slides.com/post/84828911898/slides-turns-one-year-old"
    ]
};