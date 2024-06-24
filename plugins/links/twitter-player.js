export default {

    getLink: function(twitter, whitelistRecord) {

        if (twitter.player && whitelistRecord.isAllowed && whitelistRecord.isAllowed('twitter.player')) {

            var player = {
                href: twitter.player.value || twitter.player,
                accept: [CONFIG.T.text_html, 'video/*', 'audio/*', CONFIG.T.stream_apple_mpegurl, CONFIG.T.stream_x_mpegurl],
                rel: [CONFIG.R.player, CONFIG.R.twitter],
                height: twitter.player.height
            };

            if (!whitelistRecord.isAllowed('twitter.player', 'horizontal')) {
                player.width = twitter.player.width;
            }

            // No need in adding audio, slideshow and playlist rel flags. 
            // They will be added from whitelist record via 'twitter' rel.

            if (whitelistRecord.twitter && whitelistRecord.twitter['player-autoplay']) {
                player.autoplay = whitelistRecord.twitter['player-autoplay'];
            }

            if (!whitelistRecord.isAllowed('twitter.player', 'iframely')) {
                player.rel.push(CONFIG.R.iframely); // Allows player = canonical
            }

            return player;
        }
    }
};