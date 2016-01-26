var cheerio = require('cheerio');

module.exports = {

    re: [
        /^https?:\/\/cinesport\.(\w+)\.com\/[a-zA-Z0-9-]+/i,
        /^https?:\/\/(?:www\.)?cinesport\.com\/[a-zA-Z0-9-]+/i
    ],

    mixins: ["*"],

    getMeta: function (oembed) {
        return {
            keywords: oembed.keywords
        }
    },

    getLink: function(oembed) {

        if (!(oembed.type === 'video' && oembed.html)) {
            return;
        }

        var $container = cheerio('<div>');
        try{
            $container.html(oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {

            var href = $iframe.attr('src');

            return {
                href: href,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.autoplay, CONFIG.R.html5],
                "aspect-ratio": 1 /  0.5725
            };
        }

    },

    tests: [
        "http://cinesport.stltoday.com/saint-louis-sports/matter-will-sanctions-hurt-mizzou/",
        "http://www.cinesport.com/nba/three-jimmy-butler-scores-53-points/",
        "http://www.cinesport.com/nhl/rutherford-blues-send-kroenke-message/",
        "http://cinesport.cincinnati.com/cincinnati-sports/ap-alabama-tops-clemson-title-game/"
    ]

};