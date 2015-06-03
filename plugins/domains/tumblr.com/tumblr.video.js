var $ = require('cheerio');

module.exports = {

    re: [
        /^https?:\/\/([a-z0-9-]+\.tumblr\.com)\/(post|image)\/(\d+)(?:\/[a-z0-9-]+)?/i,
        /^https?:\/\/([a-z-\.]+)\/(post)\/(\d{9,13})(?:\/[a-z0-9-]+)?/i
    ],

    mixins: false,

    getLinks: function(tumblr_post, cb) {

        if (tumblr_post.type !== "video") {
            cb(null);
        }

        if (tumblr_post.video_url) {

            cb(null, {
                href: tumblr_post.video_url,
                type: CONFIG.T.video_mp4,
                rel: CONFIG.R.player,
                "aspect-ratio": tumblr_post.thumbnail_height ? tumblr_post.thumbnail_width / tumblr_post.thumbnail_height : null
            });

        } else if (tumblr_post.player) {

            var p = tumblr_post.player[0];

            var $c = $('<div>').append(p.embed_code);
            var $iframe = $c.find('iframe');

            if ($iframe.length) {

                var width = $iframe.attr('width');
                var height = $iframe.attr('height');

                cb(null, {
                    href: $iframe.attr('src'),
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.html5],
                    "aspect-ratio": height ? width / height : null
                });

            } else {

                if (tumblr_post.permalink_url) {

                    cb({
                        redirect: tumblr_post.permalink_url
                    });

                } else {
                    cb(null, tumblr_post.player.map(function(p) {
                        return {
                            html: p.embed_code,
                            type: CONFIG.T.text_html,
                            rel: [CONFIG.R.player, CONFIG.R.inline],
                            width: p.width
                        };
                    }));
                } 
            }
        }
    },

    tests: [
        "http://fyteensontop.tumblr.com/post/58053062280/130812-fanta-fanmeeting-niel-apink-eunji-cut",
        "http://hubol.tumblr.com/post/58053061056/check-out-how-cool-this-class-is",
        "http://blog.instagram.com/post/53448889009/video-on-instagram"
        // + this one is re-direct to hulu: http://soupsoup.tumblr.com/post/41952443284/think-of-yourself-less-of-a-journalist-and-more
    ]
};