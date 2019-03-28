module.exports = {

    re: [
        /^https?:\/\/abcnews\.go\.com\/\w+\/(?:\w+\/)?video\/[a-zA-Z0-9\-_]+\-(\d+)/i        
    ],

    mixins: ["*"],

    getLink: function(urlMatch) {

        return {
                href: "https://abcnews.go.com/video/embed?id=" + urlMatch[1],                
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 640 / 360
            };
    },

    tests: [{
        noFeeds: true
    },
        "http://abcnews.go.com/GMA/video/subway-prank-college-humor-vitamin-water-mess-nyc-19893934",
        "http://abcnews.go.com/Nightline/video/bob-drag-queen-surprises-year-dressed-bob-drag-43209383",
        "http://abcnews.go.com/GMA/Wellness/video/increasing-number-children-killed-flu-epidemic-53193259"
    ]
};