module.exports = {

    mixins: [
        "oembed-author",
        "oembed-video-responsive",
        "oembed-site",
        "oembed-title",
        "oembed-thumbnail"
    ],

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