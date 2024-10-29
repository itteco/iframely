export default {

    // Canonical playlists are covered by oEmbed `http://www.dailymotion.com/services/oembed`
    re: [
        /^https?:\/\/www\.dailymotion\.com\/embed\/playlist\/([a-zA-Z0-9]+)(?:\?.+)?$/i,
        /^https?:\/\/geo\.dailymotion\.com\/player.html\?playlist=([a-zA-Z0-9]+)(?:&.+)?$/i,
    ],

    getData: function(urlMatch, cb, options) {
        cb(!options.redirectsHistory
            ? {
                redirect: `https://www.dailymotion.com/playlist/${urlMatch[1]}`
            } : null);
    },

    tests: [{
        noFeeds: true
    },
        // "https://www.dailymotion.com/playlist/x6hynp",
        "https://www.dailymotion.com/embed/playlist/x6hynp",
        "https://geo.dailymotion.com/player.html?playlist=x6hynp"
    ]
};