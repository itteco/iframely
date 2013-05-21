module.exports = {

    getLink: function(meta) {
        return {
            href: meta.twitter.player.value,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.twitter],
            "aspect-ratio": meta.twitter.player.width / meta.twitter.player.height
        };
    }
};