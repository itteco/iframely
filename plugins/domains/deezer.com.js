module.exports = {

    mixins: [
        "*"
    ],

    getLink: function(url, twitter, meta) {

        if (!twitter.player || !twitter.player.value) {

            return;

        } else {

            var href = twitter.player.value.replace(/format=square&?(amp;)?/i, '');

            var isTrack = /\/track\//i.test(url) || (meta.music && meta.music.album && meta.music.album.track == 1);

            return {
                href:  isTrack ? href.replace(/height=\d+/i, 'height=92').replace(/&width=\d+/i, '') : href,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                height: isTrack ? 92 : twitter.player.height,
                autoplay: 'autoplay=1'
            }

        }

    },

    tests: [
        "http://www.deezer.com/track/11523496",
        "http://www.deezer.com/track/61423083",
        "http://www.deezer.com/album/11417888",
        "http://www.deezer.com/album/1215117",
        "https://www.deezer.com/album/42756701" // in fact, single track
    ]
};