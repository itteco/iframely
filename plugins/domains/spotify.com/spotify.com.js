var cheerio = require('cheerio');

module.exports = {

    mixins: [
        "oembed-title",
        "oembed-thumbnail",
        "oembed-site"
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
                href: "http://d2c87l0yth4zbw.cloudfront.net/i/_global/favicon.png",
                type: CONFIG.T.image,
                rel: CONFIG.R.icon
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
        "https://open.spotify.com/user/bradgarropy/playlist/0OV99Ep2d1DCENJRPuEtXV"
    ]
};