const cheerio = require('cheerio');

module.exports = {

    re: [
        /^https?:\/\/(?:open|play|www)\.spotify\.com\/(?:track|user|album|artist|show|episode)/i
    ],

    mixins: [
        "oembed-site",
        "domain-icon"
    ],

    getMeta: function(meta) {
        return {
            title: meta.og && meta.og.title,
            date: meta.music && meta.music.release_date,
            author: meta.twitter && meta.twitter.audio && meta.twitter.audio.artist_name,
            author_url: meta.music && meta.music.musician,
            duration: meta.music && meta.music.duration,
            description: meta.og && meta.og.description,
            canonical: meta.og && meta.og.url
        }
    },

    getLink: function(oembed, meta, options) {

        var $container = cheerio('<div>');

        try {
            $container.html(oembed.html5 || oembed.html);
        } catch (ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {

            var src = $iframe.attr('src');

            var horizontal_player = options.getRequestOptions('players.horizontal', options.getProviderOptions(CONFIG.O.less));

            var player = {
                href: src,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.ssl, CONFIG.R.html5],
                options: {}
            };

            if (/album|playlist|show/.test(src)) {
                var include_playlist = options.getRequestOptions('spotify.playlist', true);
                player.rel.push(CONFIG.R.playlist);
                player.options.playlist = {
                    label: CONFIG.L.playlist,
                    value: include_playlist
                };
                player.media = horizontal_player === false && include_playlist 
                    ? {
                        'aspect-ratio': 4/3,
                        'padding-bottom': 80,
                    } : {
                        height: !include_playlist ? 80 : oembed.height || 400
                    };
            } else {
                player.rel.push(CONFIG.R.audio);
                player.options.horizontal = {
                    label: CONFIG.L.horizontal,
                    value: horizontal_player === true
                };

                player.media = horizontal_player ? {height: 80} : {
                    'aspect-ratio': 1,
                    'padding-bottom': 80,
                    'max-width': 500
                };
            }

            return [player, {
                href: (meta.og && meta.og.image) || oembed.thumbnail_url,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
            }, 
            {
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