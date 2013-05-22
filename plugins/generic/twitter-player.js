module.exports = {

    getLink: function(meta) {
        return {
            href: meta.twitter.player.value,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.twitter],
            width: meta.twitter.player.width,
            height: meta.twitter.player.height
        };
    }
};