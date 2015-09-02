module.exports = {

    mixins: [
        "*"
    ],

    getLink: function(twitter) {

        if (twitter.card !== 'player' || !twitter.player) {

            return;

        } else {

            var player = {
                href: twitter.player.value || twitter.player,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5]
            }

            if (/\.(mp3|wma)$/i.test(player.href)) {
                player.height = 40;
                player["max-width"] = 776;
            }


            if (/\.(mp4)$/i.test(player.href)) {
                player["aspect-ratio"] = twitter.player.width / twitter.player.height;
            }

            if (/playlist/i.test(player.href)) {
                player.height = 400;
                player["max-width"] = 776;
            }

            return player;

        }

    },

    tests: [
        "https://archive.org/details/um2000-09-01.shnf"
    ]
};