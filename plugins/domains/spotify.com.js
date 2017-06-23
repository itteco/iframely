var cheerio = require('cheerio');

module.exports = {

    re: [
        /^https?:\/\/(?:open|play|www)\.spotify\.com\/(?:track|user|album|artist)/i
    ],

    mixins: [
        "oembed-title",
        "oembed-thumbnail",
        "oembed-site"
        //"domain-icon"
    ],

    // keep dependency on oEmbed only. Otherwise, there's redirect to relative path for "play.*" and no embeds as a result
    // -- plugin redirect (by "htmlparser") /error/browser-not-supported.php

    getLink: function(oembed) {

        var $container = cheerio('<div>');

        try {
            $container.html(oembed.html5 || oembed.html);
        } catch (ex) {}

        var $iframe = $container.find('iframe');


        // if embed code contains <iframe>, return src
        if ($iframe.length == 1) {

            return [{
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.ssl, CONFIG.R.html5],
                height: oembed.height || 80
            }, {
                href: 'https://d2c87l0yth4zbw-2.global.ssl.fastly.net/i/_global/touch-icon-114.png',
                type: CONFIG.T.image,
                rel: CONFIG.R.icon
                // no sizes - let's validate it.
            }]
        }

    },

    tests: [{
        noFeeds: true
    }, {
            skipMixins: [
                "oembed-site", "oembed-title" // these are here as a fallback only: priority values provided by spotify.album .artist or .track
            ]
    },
        "https://play.spotify.com/user/1241058074/playlist/44CgBWWr6nlpy7bdZS8ZmN",
        "http://open.spotify.com/track/6ol4ZSifr7r3Lb2a9L5ZAB",
        "http://open.spotify.com/user/cgwest23/playlist/4SsKyjaGlrHJbRCQwpeUsz",
        "http://open.spotify.com/album/42jcZtPYrmZJhqTbUhLApi",
        "https://open.spotify.com/user/bradgarropy/playlist/0OV99Ep2d1DCENJRPuEtXV",
        "http://open.spotify.com/track/6ol4ZSifr7r3Lb2a9L5ZAB",
        "https://open.spotify.com/track/4by34YzNiEFRESAnBXo7x4",
        "https://open.spotify.com/track/2qZ36jzyP1u29KaeuMmRZx",
        "http://open.spotify.com/track/7ldU6Vh9bPCbKW2zHE65dg",
        "https://play.spotify.com/track/2vN0b6d2ogn72kL75EmN3v",
        "https://play.spotify.com/track/34zWZOSpU2V1ab0PiZCcv4",
        "https://play.spotify.com/artist/0BFm7QbsegelxqVIJdXCjq"    
    ]
};