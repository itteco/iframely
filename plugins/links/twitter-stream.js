module.exports = {

    getLink: function(twitter, whitelistRecord) {

        if (twitter.player && twitter.player.stream && (!whitelistRecord || (whitelistRecord.isAllowed && whitelistRecord.isAllowed('twitter.stream')))) {

            var player = {
                href: twitter.player.stream.value || twitter.player.stream,
                type: CONFIG.T.video_mp4,
                rel: [CONFIG.R.player, CONFIG.R.twitter],
            };

            if (whitelistRecord.isAllowed('twitter.stream', 'responsive') && twitter.player.height) {
                player['aspect-ratio'] = twitter.player.width / twitter.player.height;
            } else {
                player.width = twitter.player.width;
                player.height = twitter.player.height;
            }

            if (whitelistRecord.isAllowed('twitter.stream', 'autoplay')) {
                player.rel.push(CONFIG.R.autoplay);
            }

            return player;

        }
    }
};