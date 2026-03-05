export default {

    re: [
        /^https?:\/\/abcnews\.go\.com\/\w+\/(?:\w+\/)?video\/[a-zA-Z0-9\-_]+\-(\d+)/i,
        /^https?:\/\/abcnews\.com\/video\/(\d+)/i // format with redirect
    ],

    mixins: ["*"],

    getLink: function(urlMatch) {

        return {
                href: "https://abcnews.com/video/embed?id=" + urlMatch[1],
                type: CONFIG.T.text_html,
                rel: CONFIG.R.player,
                "aspect-ratio": 640 / 360
            };
    },

    tests: [{
        noFeeds: true
    },
        "https://abcnews.go.com/GMA/News/video/trump-hamas-disarm-disarm-126540156",
        "https://abcnews.go.com/Nightline/video/bob-drag-queen-surprises-year-dressed-bob-drag-43209383",
        "https://abcnews.go.com/GMA/Wellness/video/increasing-number-children-killed-flu-epidemic-53193259",

        // format with redirect
        "https://abcnews.com/video/126540156/",
        "https://abcnews.com/video/43209383/",
        "https://abcnews.com/video/53193259/"
    ]
};