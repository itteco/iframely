const $ = require('cheerio');

module.exports = {

    re: require('./tumblr.api').re, 

    getLink: function(tumblr_post) {

        if (tumblr_post.type == "video" && tumblr_post.video_url) {

            return {
                href: tumblr_post.video_url,
                accept: CONFIG.T.video_mp4,
                rel: CONFIG.R.player,
                "aspect-ratio": tumblr_post.thumbnail_height ? tumblr_post.thumbnail_width / tumblr_post.thumbnail_height : null
            };

        } 
    },

    getData: function(tumblr_post) {

        if (tumblr_post.type == "video" && tumblr_post.player) {

            var p = tumblr_post.player instanceof Array ? tumblr_post.player[0] : tumblr_post.player;

            var $c = $('<div>').append(p.embed_code);
            var $iframe = $c.find('iframe');

            if ($iframe.length) {

                return {
                    __promoUri: {
                        url: $iframe.attr('src'),
                        rel: 'No rel=promo is required' // this field is just for debugging here. Not required
                    }
                }
            }
        }
    },

    tests: [{skipMethods: ["getData", "getLink"]},
        "http://fyteensontop.tumblr.com/post/58053062280/130812-fanta-fanmeeting-niel-apink-eunji-cut",
        "http://hubol.tumblr.com/post/58053061056/check-out-how-cool-this-class-is",
        "http://soupsoup.tumblr.com/post/41952443284/think-of-yourself-less-of-a-journalist-and-more"
    ]
};