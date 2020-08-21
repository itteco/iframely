module.exports = {
    /**
     * Endpoint `http://www.dailymotion.com/services/oembed`
     * does not provide oembed results for playlist url currently
     */

    re: [
        /^https?:\/\/www\.dailymotion\.com\/playlist\//i,
        /^https?:\/\/www\.dailymotion\.com\/embed\/playlist\//i,
    ],

    mixins: [
        "*"
    ],

    getLink: function (url) {
        var playlistUrl = url;
        if (url.includes('playlist') && !url.includes('embed/playlist')) {
            playlistUrl = url.replace('playlist', 'embed/playlist')
        }
        return {
            href: playlistUrl,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.iframely]
        };
    },

    tests: [{
        noFeeds: true
    },
        "https://www.dailymotion.com/playlist/x6hynp",
        "https://www.dailymotion.com/embed/playlist/x6hynp"
    ]
};