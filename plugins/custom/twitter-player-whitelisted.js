module.exports = {

    getLink: function(twitter) {
        return {
            href: twitter.player.value,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.twitter, CONFIG.R.html5],
            width: twitter.player.width,
            height: twitter.player.height
        };
    }
};