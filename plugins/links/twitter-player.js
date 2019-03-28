module.exports = {

    getLink: function(twitter, whitelistRecord) {

        if (twitter.player && whitelistRecord.isAllowed && whitelistRecord.isAllowed('twitter.player')) {

            var player = {
                href: twitter.player.value || twitter.player,
                rel: [CONFIG.R.player, CONFIG.R.twitter],
                height: twitter.player.height
            };

            if (whitelistRecord.isAllowed('twitter.player', 'html5')) {
                player.type = CONFIG.T.text_html;
            } else {
                player.accept = CONFIG.T.text_html;
            }

            if (!whitelistRecord.isAllowed('twitter.player', 'horizontal')) {
                player.width = twitter.player.width;
            }

            if (!whitelistRecord.isAllowed('twitter.player', 'audio')) {
                player.rel.push[CONFIG.R.audio];
            }

            if (!whitelistRecord.isAllowed('twitter.player', 'slideshow')) {
                player.rel.push[CONFIG.R.slideshow];
            }

            if (!whitelistRecord.isAllowed('twitter.player', 'playlist')) {
                player.rel.push[CONFIG.R.playlist];
            }

            if (whitelistRecord.twitter && whitelistRecord.twitter['player-autoplay']) {
                player.autoplay = whitelistRecord.twitter['player-autoplay'];
            }

            return player;
        }
    }
};