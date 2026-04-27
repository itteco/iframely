export default {

    // Dailymotion oEmbed returns empty body for all playlist URLs.
    re: [
        /^https?:\/\/www\.dailymotion\.com\/playlist\/([a-zA-Z0-9]+)(?:\?.+)?$/i,
        /^https?:\/\/www\.dailymotion\.com\/embed\/playlist\/([a-zA-Z0-9]+)(?:\?.+)?$/i,
        /^https?:\/\/geo\.dailymotion\.com\/player.html\?playlist=([a-zA-Z0-9]+)(?:&.+)?$/i,
    ],

    getData: function(url, urlMatch, cb, options) {
        var isCanonical = /^https?:\/\/www\.dailymotion\.com\/playlist\//i.test(url);
        cb(!options.redirectsHistory && !isCanonical
            ? {
                redirect: `https://www.dailymotion.com/playlist/${urlMatch[1]}`
            } : null);
    },

    // oEmbed returns empty body for playlist URLs — build the player directly.
    getLinks: function(urlMatch) {
        return {
            href: `https://geo.dailymotion.com/player.html?playlist=${urlMatch[1]}`,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player],
            "aspect-ratio": 16 / 9
        };
    },

    tests: [{skipMethods: ['getData']}, {
        noFeeds: true
    },
        "https://www.dailymotion.com/playlist/x6hynp",
        "https://www.dailymotion.com/playlist/x6scov",

        "https://www.dailymotion.com/embed/playlist/x6hynp",
        "https://www.dailymotion.com/embed/playlist/x6scov",

        "https://geo.dailymotion.com/player.html?playlist=x6scov",
        "https://geo.dailymotion.com/player.html?playlist=x6hynp"
    ]
};