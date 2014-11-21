var _ = require("underscore");

function getStreamLinks(twitter, stream, whitelistRecord) {

    var player = {
        href: stream.value || stream,
        type: stream.type || CONFIG.T.video_mp4,
        rel: [CONFIG.R.player, CONFIG.R.twitter, "allow"],
        width: stream.width,
        height: stream.height
    };

    if (whitelistRecord && whitelistRecord.isAllowed('twitter.stream', 'responsive') && twitter.player.width && twitter.player.height) {
        player['aspect-ratio'] = twitter.player.width / twitter.player.height;
    } else {
        player.width = twitter.player.width;
        player.height = twitter.player.height;
    }

    if (whitelistRecord && whitelistRecord.isAllowed('twitter.stream', 'autoplay')) {
        player.rel.push(CONFIG.R.autoplay);
    }

    return player;
}

module.exports = {

    getLink: function(twitter, whitelistRecord) {

        if (twitter.player && twitter.player.stream && (!whitelistRecord || (whitelistRecord.isAllowed && whitelistRecord.isAllowed('twitter.stream')))) {

            var stream = twitter.player.stream;

            if (stream instanceof Array) {

                return _.flatten(stream.map(function(s) {
                    return getStreamLinks(twitter, s, whitelistRecord);
                }));

            } else if (stream) {

                return getStreamLinks(twitter, stream, whitelistRecord);
            }
        }
    }
};