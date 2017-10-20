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

        var href = twitter.player.value.replace(/^https:\/\//, 'http://'); // autoPlay = true will be removed by generic validators        
        var player = {
                href: href,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5]                
            };

        if (twitter.image && /^https?:\/\/[^\/]+\/[^\/]+\/[^\/]+\/[^\/]+$/i.test(twitter.image)) {
            player.height = 180;            
        }  else {
            player["aspect-ratio"] = twitter.player.width / twitter.player.height;
            player.autoplay = 'autoPlay=true';
        }

        return player;
    },

    tests: [{
        page: "http://www.cbc.ca/player/play/2558388650",
        selector: ".medialist-item>a"
    },
        "http://www.cbc.ca/player/play/2558388650",
        "http://www.cbc.ca/player/play/2695081582",
        "http://www.cbc.ca/player/play/2695940101"
    ]
};