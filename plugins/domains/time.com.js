module.exports = {

    mixins: [
        "*"
    ],

    getLink: function(twitter) {

        if (twitter.player && twitter.player.value) {
            return {
                href: twitter.player.value.replace(/^https:/, 'http:'), // there's a 302 to non-ssl
                rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.twitter],
                type: CONFIG.T.text_html,
                'aspect-ratio': twitter.player.width / twitter.player.height
            };
        }
    },

    tests: [{
        noFeeds: true,
        skipMixins: ['keywords']
    },
        "http://content.time.com/time/video/player/0,32068,3295741285001_2167317,00.html",
        "http://content.time.com/time/video/player/0,32068,3293479731001_2167328,00.html",
        "http://content.time.com/time/video/player/0,32068,2560009369001_2147974,00.html",
        "http://techland.time.com/2013/08/02/30-second-tech-trick-how-to-speed-up-a-slow-iphone-or-ipad/",
        "http://nation.time.com/2014/01/03/new-yorks-snowfall-in-thirty-seven-seconds/"
    ]
};