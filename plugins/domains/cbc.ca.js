export default {

    re: [
        /^https?:\/\/www\.cbc\.ca\/player\//i,
    ],

    mixins: [
        "*"
    ],

    getLink: function(twitter) {

        if (!twitter.player || !twitter.player.value) {
            return;
        }

        var player = {
                href: twitter.player.value,
                accept: CONFIG.T.text_html,
                rel: [CONFIG.R.player],
                'max-width': 1064
            };

        if (/\-\d{2,3}x\d{2,3}\.jpg$/i.test(twitter.image)) { // podcast
            player.height = 180;
            player.rel.push(CONFIG.R.audio);
        }  else {
            player["aspect-ratio"] = twitter.player.width / twitter.player.height;
        }

        return player;
    },

    tests: [
        "https://www.cbc.ca/player/play/2558388650",
        "https://www.cbc.ca/player/play/2158162499673"
    ]
};