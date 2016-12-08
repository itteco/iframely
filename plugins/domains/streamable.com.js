module.exports = {

    mixins: [
        "*"
    ],

    getLink: function(twitter) {
        return {
            href: twitter.player.value + '?autoplay=1',
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.playerjs, CONFIG.R.html5, CONFIG.R.autoplay],
            "aspect-ratio": twitter.player.width / twitter.player.height
        };
    },

    tests: [{
        noFeeds: true
    }]
};