module.exports = {

    re: [
        /^https?:\/\/www\.npr\.org\/sections\//i
    ],

    mixins: ["*"],

    getLink: function(cheerio) {

        var $button = cheerio('button[data-embed-url*="npr.org/player/embed/"]');

        if ($button.length) {
            
            var embedURL = $button.attr('data-embed-url');
            var urlMatch = embedURL.match(/npr\.org\/player\/embed\/(\d+)\/(\d+)/i);
            
            if (urlMatch) {
                return {
                    href: "http://www.npr.org/player/embed/" + urlMatch[1] + "/" + urlMatch[2],
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.app], // `app` prevents it from being wrapped as promo card
                    height: 290,
                    'max-width': 800
                };
            }
        }

    },

    tests: [
        "http://www.npr.org/sections/thetwo-way/2016/04/11/473874785/hundreds-protest-gerrymandering-campaign-finance-laws-on-capitols-steps",
        "http://www.npr.org/sections/alltechconsidered/2015/04/29/401236656/libraries-make-space-for-3-d-printers-rules-are-sure-to-follow",
        "http://www.npr.org/sections/itsallpolitics/2015/08/27/434872755/exactly-what-kind-of-socialist-is-bernie-sanders"
    ]
};