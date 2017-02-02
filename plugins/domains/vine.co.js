module.exports = {

    re:[
        /^https?:\/\/vine\.co\/v\/(\w+)/i
    ],

    mixins: [
        "*"
    ],

    getLink: function (urlMatch) {

        return {
            href: "https://vine.co/v/" + urlMatch[1] + '/embed/simple',
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.oembed, CONFIG.R.html5],
            "aspect-ratio": 1
        }
    },

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