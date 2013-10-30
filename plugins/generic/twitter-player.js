module.exports = {

    getLink: function(meta, whitelistRecord) {

        if (meta.twitter && meta.twitter.player && whitelistRecord.isAllowed && whitelistRecord.isAllowed('twitter.player')) {

            return {
                href: meta.twitter.player.value || meta.twitter.player,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.twitter],
                width: meta.twitter.player.width,
                height: meta.twitter.player.height
            };
        }
    }
};