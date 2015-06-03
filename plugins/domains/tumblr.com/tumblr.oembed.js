module.exports = {

    re: [
        /^https?:\/\/([a-z0-9-]+\.tumblr\.com)\/(post|image)\/(\d+)(?:\/[a-z0-9-]+)?/i,
        /^https?:\/\/([a-z-\.]+)\/(post)\/(\d{9,13})(?:\/[a-z0-9-]+)?/i
    ],

    mixins: false,

    getLink: function(tumblr_post, oembed) {

        if (!oembed.html) {
            return;
        }

        // Tumblr oembeds are not SSL yet // March 2, 2015
        var rel = [CONFIG.R.oembed, CONFIG.R.inline];

        if (tumblr_post.type !== "text") {
            rel.push (CONFIG.R.app);
        } else {
            rel.push (CONFIG.R.reader);
        }

        return {
            type: CONFIG.T.text_html,
            html: oembed.html,
            rel: rel,
            "max-width": oembed.width
        };
    },

    tests: [
        "http://fewthistle.tumblr.com/post/58045916432"
    ]
};