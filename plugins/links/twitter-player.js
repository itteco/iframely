module.exports = {

    getLink: function(twitter, whitelistRecord) {

        if (twitter.player && whitelistRecord.isAllowed && whitelistRecord.isAllowed('twitter.player')) {

            var type = whitelistRecord.isAllowed('twitter.player', 'html5') ? CONFIG.T.text_html : CONFIG.T.maybe_text_html;

            var player =  {
                href: twitter.player.value || twitter.player,
                type: type,
                rel: [CONFIG.R.player, CONFIG.R.twitter],
                height: twitter.player.height
            };

            if (!whitelistRecord.isAllowed('twitter.player', 'horizontal')) {
                player.width = twitter.player.width;
            }

            if (whitelistRecord.twitter && whitelistRecord.twitter['player-autoplay']) {
                player.autoplay = whitelistRecord.twitter['player-autoplay'];
            }

            return player;
        }
    }
};