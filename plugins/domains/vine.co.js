module.exports = {

    mixins: [
        "oembed-author",
        "oembed-video-responsive",
        "oembed-site",
        "oembed-title",
        "oembed-thumbnail"
    ],

    getLink: function(twitter) {
        return {
            href: twitter.player.stream.value,
            type: CONFIG.T.video_mp4,
            rel: CONFIG.R.player,
            "aspect-ratio": twitter.player.width / twitter.player.height,
            "max-width": twitter.player.width,
            "max-height": twitter.player.height

        }
    },

    tests: [
        "https://vine.co/v/bjHh0zHdgZT",
        "https://vine.co/v/blhUa7aLYgr",
        "https://vine.co/v/blrJgOKXg19",
        "https://vine.co/v/blr5dvQn2xU",
        "https://vine.co/v/blrexgYzeve",
        {
            noFeeds: true
        }
    ]
};