module.exports = {

    mixins: [
        "og-title",
        "og-site",
        "og-image",
        "video",
        "favicon"
    ],

    getLink: function (meta) {
        return {
            href: meta.twitter.player.value,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.twitter],
            "aspect-ratio": meta.twitter.player.width / meta.twitter.player.height,
            "max-width": meta.twitter.player.width,
            "max-height": meta.twitter.player.height
        };
    },

    tests: [
        "http://www.viddy.com/video/d2000a03-149d-48d4-a7ec-6121300bc7f3?source=Trending"
    ]
};