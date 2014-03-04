module.exports = {

    getLink: function(twitter) {
        return {
            href: twitter.player.value,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.twitter],
            width: twitter.player.width,
            height: twitter.player.height
        };
    }
};