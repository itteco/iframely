module.exports = {

    re: /http:\/\/content\.time\.com\/time\/video\/player\/.+/i,

    mixins: [
        "twitter-image",
        "favicon",
        "canonical",
        "twitter-description",
        "og-site",
        "twitter-title"
    ],

    getLink: function(twitter) {
        return {
            href: twitter.player.value.replace(/^https:/, 'http:'),
            rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.twitter],
            type: CONFIG.T.text_html,
            'aspect-ratio': twitter.player.width / twitter.player.height
        };
    },

    tests: [{
        noFeeds: true
    },
        "http://content.time.com/time/video/player/0,32068,3295741285001_2167317,00.html",
        "http://content.time.com/time/video/player/0,32068,3293479731001_2167328,00.html",
        "http://content.time.com/time/video/player/0,32068,2560009369001_2147974,00.html"
    ]
};