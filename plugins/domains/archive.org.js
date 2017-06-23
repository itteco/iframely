module.exports = {

    mixins: [
        "*"
    ],

    getLink: function(twitter) {

        if (twitter.card !== 'player' || !twitter.player) {

            return;

        } else {

            var playerHref = twitter.player.value || twitter.player;
            var hrefMatch = playerHref.match(/^https?:\/\/archive\.org\/embed\/([^\/]+)\/?/i); 

            if (hrefMatch) {

                var player = {
                    href: 'https://archive.org/embed/' + hrefMatch[1],
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.html5]
                };

                if (/\.(mp3|wma)$/i.test(playerHref)) {
                    player.height = 40;
                    player["max-width"] = 776;
                }


                if (/\.(mp4|avi|mov|mpeg)$/i.test(playerHref)) {
                    player["aspect-ratio"] = twitter.player.width / twitter.player.height;
                }

                if (/playlist/i.test(playerHref)) {
                    player.height = 250;
                    player["max-width"] = 776;
                }

                return player;
            }

        }

    },

    tests: [{
        page: "https://archive.org/details/audio_tech?&sort=-downloads&page=2",
        selector: ".item-ttl>a"
    },
        "https://archive.org/details/Podcast8.23GoethesIronicMephistopheles1700s1800s",
        "https://archive.org/details/TheInternetArchivistsFinalCutBoostedSound",
        "https://archive.org/details/um2000-09-01.shnf",
        "https://archive.org/details/ChronoTrigger_456",
        "https://archive.org/details/YourFami1948"
    ]
};