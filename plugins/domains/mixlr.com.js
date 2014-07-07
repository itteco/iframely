module.exports = {

    mixins: [
        "og-image",
        "twitter-image",
        "favicon",
        "canonical",
        "twitter-description",
        "keywords",
        "media-detector",
        "twitter-title"
    ],

    getLinks: function(og, twitter) {
        return [{
            href: twitter.player.value,
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            height: 185
        }, {
            href: og.video.url,
            type: CONFIG.T.flash,
            rel: [CONFIG.R.player, CONFIG.R.autoplay],
            height: 185
        }];
    },

    tests: [{
        noFeeds: true
    },
        "http://mixlr.com/voice-of-charity/"
    ]
};