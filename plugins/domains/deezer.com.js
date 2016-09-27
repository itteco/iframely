module.exports = {

    mixins: [
        "*"
    ],

    getLink: function(url, twitter) {

        if (!twitter.player || !twitter.player.value) {

            return;

        } else {

            var href = twitter.player.value.replace(/format=square&?(amp;)?/i, '');            

            return {
                href: /\/track\//i.test(url) ? href.replace(/&height=\d+/i, '&height=92') : href,
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