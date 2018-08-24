module.exports = {

    re: [
        /^https?:\/\/www\.npr\.org\/sections\//i,
        /^https?:\/\/www\.npr\.org\/\d{4}\/\d{2}\/\d{2}\/\d+\//i        
    ],

    mixins: ["*"],

    getLink: function(cheerio) {

        var $button = cheerio('button[data-embed-url*="npr.org/player/embed/"]');

        if ($button.length) {
            
            var embedURL = $button.attr('data-embed-url');
            var urlMatch = embedURL.match(/npr\.org\/player\/embed\/(\d+)\/(\d+)/i);
            
            if (urlMatch) {
                return {
                    href: "//www.npr.org/player/embed/" + urlMatch[1] + "/" + urlMatch[2],
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.app], // `app` prevents it from being wrapped as promo card
                    height: 290,
                    'max-width': 800
                };
            }

        } else { // try embedded video for NPR Music section

            var $player = cheerio('[data-jwplayer]');

            if ($player.length) {
                
                var config = JSON.parse($player.attr('data-jwplayer'));
                
                return {
                    href: config.embedLink,
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.html5, CONFIG.R.player, CONFIG.R.app], // `app` prevents it from being wrapped as promo card],
                    'aspect-ratio': 16 / 9
                };
            }
        }
    },

    tests: [
        "http://www.npr.org/sections/thetwo-way/2016/04/11/473874785/hundreds-protest-gerrymandering-campaign-finance-laws-on-capitols-steps",
        "http://www.npr.org/sections/alltechconsidered/2015/04/29/401236656/libraries-make-space-for-3-d-printers-rules-are-sure-to-follow",
        "http://www.npr.org/sections/itsallpolitics/2015/08/27/434872755/exactly-what-kind-of-socialist-is-bernie-sanders",
        // "http://www.npr.org/2016/05/04/476793671/first-listen-mudcrutch-2"
        "http://www.npr.org/2016/08/12/489769830/anderson-paak-the-free-nationals-tiny-desk-concert" // jw player
    ]
};