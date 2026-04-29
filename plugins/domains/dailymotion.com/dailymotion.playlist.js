import got from 'got';

export default {

    // Dailymotion oEmbed returns empty body for all playlist URLs.
    re: [
        /^https?:\/\/www\.dailymotion\.com\/playlist\/([a-zA-Z0-9]+)(?:\?.+)?$/i,
        /^https?:\/\/www\.dailymotion\.com\/embed\/playlist\/([a-zA-Z0-9]+)(?:\?.+)?$/i,
        /^https?:\/\/geo\.dailymotion\.com\/player.html\?playlist=([a-zA-Z0-9]+)(?:&.+)?$/i,
    ],

    mixins: ['*'],

    // oEmbed returns empty body for playlist URLs — build the player directly.
    getLink: function(urlMatch) {
        return {
            href: `https://geo.dailymotion.com/player.html?playlist=${urlMatch[1]}`,
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 16 / 9
        };
    },

    getData: function(url, urlMatch, cb, options) {
        var isCanonical = /^https?:\/\/www\.dailymotion\.com\/playlist\//i.test(url);

        if (!options.redirectsHistory && !isCanonical) {
            return cb({ redirect: `https://www.dailymotion.com/playlist/${urlMatch[1]}` });
        }

        if (isCanonical) {
            got(`https://geo.dailymotion.com/playlist/${urlMatch[1]}.json?legacy=true&parallelCalls=1`, { responseType: 'json' })
                .then(response => {
                    if (response.body && response.body.error && response.body.error.type === 'not_found') {
                        cb({ responseStatusCode: 404 });
                    } else {
                        cb(null);
                    }
                })
                .catch(() => cb(null));
        } else {
            cb(null);
        }
    },

    tests: [{skipMethods: ['getData']}, {
        noFeeds: true
    },
        "https://www.dailymotion.com/playlist/x6hynp",
        "https://www.dailymotion.com/playlist/x6scov",

        "https://www.dailymotion.com/embed/playlist/x6hynp",
        "https://www.dailymotion.com/embed/playlist/x6scov",

        "https://geo.dailymotion.com/player.html?playlist=x6hynp",
        "https://geo.dailymotion.com/player.html?playlist=x6scov"

        /* Non-existing playlists return HTTP 404:
        "https://www.dailymotion.com/playlist/xINVALID999",
        "https://www.dailymotion.com/embed/playlist/xINVALID999",
        "https://geo.dailymotion.com/player.html?playlist=xINVALID999"
        */
    ]
};