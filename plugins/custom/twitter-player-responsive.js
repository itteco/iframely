module.exports = {

    getLink: function(twitter) {
        return {
            href: twitter.player && twitter.player.value,
            type: CONFIG.T.maybe_text_html,
            rel: [CONFIG.R.player, CONFIG.R.twitter, CONFIG.R.html5],
            "aspect-ratio": twitter.player && twitter.player.width / twitter.player.height
        };
    }
};