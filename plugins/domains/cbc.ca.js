module.exports = {

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
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                autoplay: 'autoPlay=true'
            };

        if (/\-\d{2,3}x\d{2,3}\.jpg$/i.test(twitter.image)) { // podcast
            player.height = 180;
            player.rel.push(CONFIG.R.audio);
        }  else {
            player["aspect-ratio"] = twitter.player.width / twitter.player.height;
        }

        return player;
    },

    tests: [{
        page: "http://www.cbc.ca/player/play/2558388650",
        selector: ".medialist-item>a"
    },
        "http://www.cbc.ca/player/play/2558388650",
        "http://www.cbc.ca/player/play/2695081582",
        "http://www.cbc.ca/player/play/2695940101",
        "http://www.cbc.ca/player/play/1218762307729/"
    ]
};