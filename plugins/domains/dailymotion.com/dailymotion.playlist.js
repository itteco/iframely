module.exports = {

    // Endpoint http://www.dailymotion.com/services/oembed
    // does not provide oembed results for playlist url currently
    re: [
        /^https?:\/\/www\.dailymotion\.com\/playlist\//i,
        /^https?:\/\/www\.dailymotion\.com\/embed\/playlist\//i,
    ],

    getLink: function (url) {

        if (url.includes('playlist') && !url.includes('embed/playlist')) {
            url = url.replace('playlist', 'embed/playlist')
        }
        return {
            href: url,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 16/9,
        };
    },

    tests: [{
        noFeeds: true
    },
        "https://www.dailymotion.com/playlist/x6hynp",
        "https://www.dailymotion.com/embed/playlist/x6hynp"
    ]
};