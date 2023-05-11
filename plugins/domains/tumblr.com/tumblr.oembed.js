/* Tumblr embed codes are broken as of Feb 13, 2020 */

export default {

    re: 'tumblr.api',

    getLink: function(tumblr_post, oembed, options) {

        if (!oembed.html) {
            return;
        }

        var media_only = options.getProviderOptions('tumblr.media_only', false);
        if ((tumblr_post.type === "photo" || tumblr_post.type === "video") && media_only) {
            return;
        }

        var rel = [CONFIG.R.oembed, CONFIG.R.inline];

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
        "http://fewthistle.tumblr.com/post/58045916432",
        "https://nasa.tumblr.com/post/186150527809/pew-pew-pew-imagine-slow-motion-fireworks-that"
    ]
};