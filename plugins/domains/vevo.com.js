var URL = require("url");
var QueryString = require("querystring");

module.exports = {

    re:[
        /^https?:\/\/www\.vevo\.com\/watch\//i
    ],

    mixins: [
        "*"
    ],

    getLinks: function (twitter, whitelistRecord) {

        if ((whitelistRecord.isDefault || !whitelistRecord.isAllowed('twitter.player') || whitelistRecord.isAllowed('twitter.player', 'autoplay')) && twitter.player) {

            var href = URL.parse(twitter.player.value, true);
            var query = href.query;

            if (query.isrc) {

                return [{
                    href: 'https://scache.vevo.com/assets/html/embed.html?video=' + query.isrc + '&autoplay=0',
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.html5],
                    "aspect-ratio": twitter.player.width / twitter.player.height
                }, {
                    href: 'http://cache.vevo.com/assets/html/embed.html?video=' + query.isrc + '&autoplay=0',
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.html5],
                    "aspect-ratio": twitter.player.width / twitter.player.height
                }]
            }
        }
    },

    tests: [
        "http://www.vevo.com/watch/ellie-goulding/Still-Falling-For-You/GBUV71601272"
    ]
};