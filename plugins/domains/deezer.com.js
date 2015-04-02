module.exports = {

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "twitter-description",
        "media-detector",
        "og-site",
        "twitter-title"
    ],

    getLink: function(twitter) {
        return {
            href: twitter.player.value,
            rel: [CONFIG.R.player, CONFIG.R.ssl, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            height: twitter.player.height
        };
    },

    tests: [{
        noFeeds: true
    },
        "http://www.deezer.com/playlist/151196621",
        "http://www.deezer.com/album/8983161"
    ]

};