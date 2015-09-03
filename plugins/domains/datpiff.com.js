module.exports = {

    mixins: [
        "*"
    ],

    getLink: function(twitter) {
        var m = twitter.image.src.match(/^http:\/\/hw-img\.datpiff\.com\/(\w+)\//);

        if (m) {
            return {
                href: 'http://www.datpiff.com/embed/' + m[1] + '/',
                type: CONFIG.T.text_html,
                rel: CONFIG.R.player,
                "aspect-ratio": 525 / 270
            };
        }
    },

    tests: [{
        pageWithFeed: 'http://www.datpiff.com/'
    },
        "http://www.datpiff.com/Casino-G-100-Grand-On-Da-Table-Chopper-By-The-Door-mixtape.698416.html",
        "http://www.datpiff.com/Cheeze-SWC-Still-Wit-Coke-mixtape.694346.html",
        "http://www.datpiff.com/Rick-Ross-Black-Dollar-mixtape.732049.html"
    ]

};