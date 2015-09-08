module.exports = {

    re: [
        /^https?:\/\/([a-z0-9-]+\.tumblr\.com)\/(post|image)\/(\d+)(?:\/[a-z0-9-]+)?/i,
        /^https?:\/\/([a-z-\.]+)\/(post)\/(\d{9,13})(?:\/[a-z0-9-]+)?/i
    ],

    getLink: function(tumblr_post, oembed) {

        if (!oembed.html) {
            return;
        }

        var rel = [CONFIG.R.oembed, CONFIG.R.inline, CONFIG.R.html5];

        if (!/http:\/\/embed\.tumblr\.com\/embed\//i.test(oembed.html)) { rel.push(CONFIG.R.ssl); }
        // We could also try to replace http:// with https://, 
        // but it appears Tumblr knows better when their embeds are not SSL-friendly and returns only http:// when required.

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