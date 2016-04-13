module.exports = {

    mixins: [
        "*"
    ],

    getLink: function(url, twitter) {

        if (twitter.card !== 'player' || !twitter.player) {

            return;

        } else {

            return {
                href: /\/track\//i.test(url) ? twitter.player.value.replace(/&height=\d+/i, '&height=92') : twitter.player.value,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                height: /\/track\//i.test(url) ? 92 : twitter.player.height
            }

        }

    },

    tests: [
        "http://www.deezer.com/track/11523496",
        "http://www.deezer.com/track/61423083",
        "http://www.deezer.com/album/11417888",
        "http://www.deezer.com/album/1215117"
    ]
};