var cheerio = require('cheerio');

module.exports = {

    mixins: [
        "twitter-title",
        "twitter-image",
        "canonical",
        "favicon",
        "oembed-thumbnail",
        "oembed-site"
    ],

    getLink: function(oembed) {

        var $container = cheerio('<div>');

        try {
            $container.html(oembed.html5 || oembed.html);
        } catch (ex) {}

        var $iframe = $container.find('iframe');


        // if embed code contains <iframe>, return src
        if ($iframe.length == 1) {

            return {
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.ssl, CONFIG.R.html5],
                 "aspect-ratio":  100 / 115 // hardcode here as otherwise there's blank space beneath the player
            }
        }

    },

    tests: [
        "http://open.spotify.com/track/6ol4ZSifr7r3Lb2a9L5ZAB",
        "http://open.spotify.com/user/cgwest23/playlist/4SsKyjaGlrHJbRCQwpeUsz",
        "http://open.spotify.com/album/42jcZtPYrmZJhqTbUhLApi"
    ]
};