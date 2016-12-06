module.exports = {

    mixins: [
        "og-image",
        "canonical",
        "og-description",
        "media-detector",
        "og-title",
        "twitter-stream"
    ],

    // fixes incorrect aspect ratio of 320 / 260
    getLink: function(twitter) {

        if (twitter.player && twitter.player.value) {

            var aspect = twitter.player.width / twitter.player;
                
            return {
                href: twitter.player.value,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                type: CONFIG.T.text_html,
                "aspect-ratio": aspect < 4/3 ? 16/9 : aspect
            }
        }
    },

    tests: [
        "https://content.jwplatform.com/players/s6tol0gj-plsZnDJi.html"
    ]
};