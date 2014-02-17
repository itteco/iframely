module.exports = {

    getLink: function(twitter) {
        return {
            href: twitter.player.value,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.twitter],
            "aspect-ratio": twitter.player.width / twitter.player.height
        };
    }
};