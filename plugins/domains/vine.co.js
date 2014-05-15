module.exports = {

    mixins: [
        "twitter-image",
        "og-title",
        "og-site",
        "favicon"
    ],

    getLinks: function (twitter) {

        return {
            href: twitter.player.value.replace("/card", "/embed/simple"),
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": twitter.player.width / twitter.player.height
        }
    },

    tests: [
        "https://vine.co/v/bjHh0zHdgZT",
        "https://vine.co/v/blhUa7aLYgr",
        "https://vine.co/v/blrJFX11Ldi",
        "https://vine.co/v/blrJgOKXg19",
        "https://vine.co/v/blr5dvQn2xU",
        "https://vine.co/v/blrexgYzeve",
        {
            noFeeds: true
        }
    ]
};