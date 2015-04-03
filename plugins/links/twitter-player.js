module.exports = {

    getLink: function(twitter, whitelistRecord) {

        if (twitter.player && whitelistRecord.isAllowed && whitelistRecord.isAllowed('twitter.player')) {

            var type = whitelistRecord.isAllowed('twitter.player', 'html5') ? CONFIG.T.text_html : CONFIG.T.maybe_text_html;

            return {
                href: twitter.player.value || twitter.player,
                type: type,
                rel: [CONFIG.R.player, CONFIG.R.twitter],
                width: twitter.player.width,
                height: twitter.player.height
            };
        }
    }
};