var cheerio = require('cheerio');

module.exports = {

    re: [
        /^https?:\/\/(?:open|play|www)\.spotify\.com\/(?:track|user|album|artist|show|episode)/i
    ],

    mixins: [
        "oembed-title",
        "oembed-thumbnail",
        "oembed-site",
        "domain-icon"
    ],

    getMeta: function(meta) {
        return {
            date: meta.music && meta.music.release_date,
            author: meta.twitter && meta.twitter.audio && meta.twitter.audio.artist_name,
            author_url: meta.music && meta.music.musician,
            duration: meta.music && meta.music.duration
        }
    },

    getLink: function(oembed, options) {

        var $container = cheerio('<div>');

        try {
            $container.html(oembed.html5 || oembed.html);
        } catch (ex) {}

        var $iframe = $container.find('iframe');


        // if embed code contains <iframe>, return src
        if ($iframe.length == 1) {

            var src = $iframe.attr('src');

            // configure as `theme: 'white'`
            if (options.getProviderOptions('spotify.theme')) {
                src += (src.indexOf ('?') == -1 ? '?' : '&') + 'theme=' + options.getProviderOptions('spotify.theme');
            }

            var horizontal_player = options.getProviderOptions(CONFIG.O.compact, false) || (/\/track|episode/i.test(src) && (options.getProviderOptions('players.horizontal', false) || options.getProviderOptions('soundcloud.old_player', false) || options.getProviderOptions('bandcamp.small_player', false)));

            var player = {
                href: src,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.ssl, CONFIG.R.html5],
                height: horizontal_player ? 80 : (oembed.height || 300)
            };

            if (/album|playlist|show/.test(src)) {
                player.rel.push(CONFIG.R.playlist);
            } else {
                player.rel.push(CONFIG.R.audio);
            }

            return [player, {
                href: 'https://open.scdn.co/static/images/touch-icon-114.png',
                type: CONFIG.T.image,
                rel: CONFIG.R.icon
                // no sizes - let's validate it.
            }]
        }

    },

    getData: function (url, options, cb) {

        if (!options.redirectsHistory && /^https?:\/\/play\./i.test(url)) {
            return cb ({
                redirect: url.replace(/^https?:\/\/play\./i, 'https://open.')
            })
        } else {
            cb(null);
        }
    },    

    tests: [{noFeeds: true}, {skipMethods: ["getData"]},
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
        "https://open.spotify.com/show/7gozmLqbcbr6PScMjc0Zl4?si=nUubrGA2Sj-2pYPgkSWYrA",
        "https://open.spotify.com/episode/7qPeNdwJ8JiAFQC65Ik7MW"
    ]
};