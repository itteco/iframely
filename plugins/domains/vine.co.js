module.exports = {

    mixins: [
        "twitter-player",
        "twitter-stream",
        "oembed-video",
        "oembed-thumbnail",
        "favicon",
        "oembed-author",
        "canonical",
        "twitter-description",
        "oembed-site",
        "oembed-title"
    ],

    // plugin is left for tests and speed mostly, as it is well covered by generic plugins
    tests: [
        "https://vine.co/v/bjHh0zHdgZT",
        "https://vine.co/v/blrJgOKXg19",
        "https://vine.co/v/blr5dvQn2xU",
        "https://vine.co/v/blrexgYzeve",
        {
            noFeeds: true
        }
    ]
};