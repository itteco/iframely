function getStreamLinks(twitter, stream, whitelistRecord) {

    var player = {
        href: stream.value || stream,
        accept: ['video/*', 'audio/*', CONFIG.T.stream_apple_mpegurl, CONFIG.T.stream_x_mpegurl],
        rel: [CONFIG.R.player, CONFIG.R.twitter, "allow"],
        width: stream.width,
        height: stream.height
    };

    if (whitelistRecord.isAllowed('twitter.stream', 'responsive') && twitter.player.width && twitter.player.height) {
        player['aspect-ratio'] = twitter.player.width / twitter.player.height;
    } else if (whitelistRecord.isAllowed('twitter.stream', 'horizontal')) {
        player.height = twitter.player.height || 32;
    } else {
        player.width = twitter.player.width;
        player.height = twitter.player.height;
    }

    if (whitelistRecord.isAllowed('twitter.stream', 'autoplay')) {
        player.rel.push(CONFIG.R.autoplay);
    }

    if (whitelistRecord.isAllowed('twitter.stream', 'accept')) {
        player.accept.push(CONFIG.T.text_html);
    }

    if (whitelistRecord.isAllowed('twitter.stream', 'gifv')) {
        player.rel.push(CONFIG.R.gifv);
        player.accept = CONFIG.T.video_mp4
    }

    return player;
}

export default {

    getLink: function(twitter, whitelistRecord) {

        if (twitter.player && twitter.player.stream && whitelistRecord.isAllowed && whitelistRecord.isAllowed('twitter.stream')) {

            var stream = twitter.player.stream;

            if (stream instanceof Array) {
                return stream.map(function(s) {
                    return getStreamLinks(twitter, s, whitelistRecord);
                }).flat();

            } else if (stream) {
                return getStreamLinks(twitter, stream, whitelistRecord);
            }
        }
    }
};