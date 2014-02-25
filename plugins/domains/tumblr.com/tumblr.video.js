var jquery = require('jquery');

module.exports = {

    getLinks: function(tumblr_post) {

        if (tumblr_post.type !== "video") {
            return;
        }

        if (tumblr_post.video_url) {

            return {
                href: tumblr_post.video_url,
                type: CONFIG.T.video_mp4,
                rel: CONFIG.R.player,
                "aspect-ratio": tumblr_post.thumbnail_height ? tumblr_post.thumbnail_width / tumblr_post.thumbnail_height : null
            };

        } else if (tumblr_post.player) {

            var p = tumblr_post.player[0];

            var $c = jquery('<div>').append(p.embed_code);
            var $iframe = $c.find('iframe');

            if ($iframe.length) {

                var width = $iframe.attr('width');
                var height = $iframe.attr('height');

                return {
                    href: $iframe.attr('src'),
                    type: CONFIG.T.text_html,
                    rel: CONFIG.R.player,
                    "aspect-ratio": height ? width / height : null
                };

            } else {

                return tumblr_post.player.map(function(p) {
                    return {
                        html: p.embed_code,
                        type: CONFIG.T.text_html,
                        rel: [CONFIG.R.player, CONFIG.R.inline],
                        width: p.width
                    };
                });
            }
        }
    },

    tests: [
        "http://fyteensontop.tumblr.com/post/58053062280/130812-fanta-fanmeeting-niel-apink-eunji-cut",
        "http://hubol.tumblr.com/post/58053061056/check-out-how-cool-this-class-is"
    ]
};