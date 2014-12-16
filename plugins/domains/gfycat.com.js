module.exports = {

    mixins: [
        "favicon",
        "keywords",
        "twitter-title",
        "twitter-description",
        "twitter-image"
    ],

    getLink: function(twitter) {
        return {
            href: twitter.player.stream[1].value,
            type: CONFIG.T.video_webm,
            rel: [CONFIG.R.player, CONFIG.R.gifv],
            width: twitter.player.width,
            height: twitter.player.height
        };
    },

    tests: [{
        page: "http://www.reddit.com/r/gfycats",
        selector: "a.title"
    },
        "http://gfycat.com/DismalUnacceptableErne"
    ]
};