export default {

    re: [
        /^https?:\/\/(?:open|play|www)\.spotify\.com\/(?:track|album|artist|show|episode|playlist)/i
    ],

    mixins: [
        "oembed-title",
        "oembed-iframe",
        "og-image",
        "oembed-thumbnail",
        "domain-icon"
    ],

    getMeta: function(meta) {
        return {
            date: meta.music && meta.music.release_date,
            author: meta.twitter && meta.twitter.audio && meta.twitter.audio.artist_name,
            author_url: meta.music && meta.music.musician,
            duration: meta.music && meta.music.duration,
            description: meta.og && meta.og.description,
            canonical: meta.og && meta.og.url,
            site: meta.og && meta.og.site_name || 'Spotify'
        }
    },

    getLink: function(iframe, options) {

        if (iframe.src) {

            var src = iframe.src;

            var horizontal_player = options.getRequestOptions('players.horizontal', options.getProviderOptions(CONFIG.O.less));

            var player = {
                href: src,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.ssl, CONFIG.R.html5],
                options: {}
            };

            if (/album|playlist/.test(src)) {
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
                        height: !include_playlist ? 80 : (iframe.height || 400)
                    };

                // Temp fix for broken v2 playlist.
                player.href = src.replace(/\/embed\/playlist\-v2\//, '/embed/playlist/');
            } else if (/episode|show/.test(src)) {
                player.rel.push(CONFIG.R.audio);
                player.height = iframe.height || 232;
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

            return player;
        }

    },

    getData: function (url, options, cb) {

        options.exposeStatusCode = true; // fallback for playlists - now 404s
        options.followHTTPRedirect = true;

        const trackInAlbumRegex = /^https?:\/\/open\.spotify\.com\/album\/[a-zA-Z0-9]+\?highlight=spotify:track:([a-zA-Z0-9]+)/i;

        if (!options.redirectsHistory && /^https?:\/\/play\./i.test(url)) {
            return cb ({
                redirect: url.replace(/^https?:\/\/play\./i, 'https://open.')
            })
        } else if (!options.redirectsHistory 
            && trackInAlbumRegex.test(url)) {
            return cb ({
                redirect: 'https://open.spotify.com/track/' + url.match(trackInAlbumRegex)[1]
            })            

        } else {
            cb(null);
        }
    },    

    tests: [{noFeeds: true}, {skipMethods: ["getData"], skipMixins: ["oembed-iframe", "oembed-thumbnail", "og-image"]},
        "https://open.spotify.com/playlist/44CgBWWr6nlpy7bdZS8ZmN",
        "http://open.spotify.com/track/6ol4ZSifr7r3Lb2a9L5ZAB",
        "https://open.spotify.com/playlist/4SsKyjaGlrHJbRCQwpeUsz",
        "http://open.spotify.com/album/42jcZtPYrmZJhqTbUhLApi",
        "https://open.spotify.com/playlist/0OV99Ep2d1DCENJRPuEtXV",
        "http://open.spotify.com/track/6ol4ZSifr7r3Lb2a9L5ZAB",
        "https://open.spotify.com/track/4by34YzNiEFRESAnBXo7x4",
        "https://open.spotify.com/track/2qZ36jzyP1u29KaeuMmRZx",
        "http://open.spotify.com/track/7ldU6Vh9bPCbKW2zHE65dg",
        "https://play.spotify.com/track/2vN0b6d2ogn72kL75EmN3v",
        "https://play.spotify.com/track/34zWZOSpU2V1ab0PiZCcv4",
        "https://open.spotify.com/show/7gozmLqbcbr6PScMjc0Zl4?si=nUubrGA2Sj-2pYPgkSWYrA",
        "https://open.spotify.com/episode/7qPeNdwJ8JiAFQC65Ik7MW",
        "https://open.spotify.com/episode/48Hca47BsH35I2GS0trj68",
        "https://open.spotify.com/album/3obcdB2QRQMfUBHzjOto4K?highlight=spotify:track:2qZ36jzyP1u29KaeuMmRZx"
    ]
};