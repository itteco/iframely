module.exports = {

    mixins: [
        "*"
    ],

    getLink: function(twitter) {

        if (twitter.player && twitter.player.value && /^https?:\/\/html5\-player\.libsyn\.com\/embed\/episode\/id\/\d+/i.test(twitter.player.value)) {

            var href = twitter.player.value.match(/^https?:\/\/html5\-player\.libsyn\.com\/embed\/episode\/id\/\d+/i)[0];
            href += '/theme/custom/';

            var player = {
                href: href,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                type: CONFIG.T.text_html, 
            };

            if (twitter.stream && twitter.stream.value && /\.mp4$/i.test(twitter.stream.value)) {
                player['aspect-ratio'] = 16/9;
                player['padding-bottom'] = 90;
            } else {
                player.height = 90;
            }
                
            return player;
        }
    },

    tests: [
        "http://3manbreak.libsyn.com/10-build-a-bear-for-bradley-beal-december-1-of-3",
        "http://directory.libsyn.com/episode/index/id/3252958",
        // "http://mohrstories.libsyn.com/podcast/mor-stories-267-john-dimaggio", // broken
        "http://mumiapodcast.libsyn.com/message-for-red-emmas-book-fair-saturday-9-26-2015-baltimore",
        "http://3manbreak.libsyn.com/10-build-a-bear-for-bradley-beal-december-1-of-3"
    ]
};