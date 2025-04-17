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

            if (whitelistRecord.isAllowed('twitter.player', 'iframely')) {
                // Allow player = canonical
                player.rel.push(CONFIG.R.iframely);

                // Also skip type validation.
                // Ex.: https://www.billoreilly.com/video?chartID=330&pid=37561
                //      https://video.tv.adobe.com/v/3424206
                player.type = CONFIG.T.text_html;
                delete player.accept;
            }

            return player;
        }
    }
};