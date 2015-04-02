module.exports = {

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "twitter-description",
        "keywords",
        "media-detector",
        "og-site",
        "meta-title"
    ],

    getLink: function(og) {
        var m = og.image.match(/^http:\/\/hw-img\.datpiff\.com\/(\w+)\//);

        if (m) {
            return {
                href: 'http://www.datpiff.com/embed/' + m[1] + '/',
                type: CONFIG.T.text_html,
                rel: CONFIG.R.player
            };
        }
    },

    tests: [{
        pageWithFeed: 'http://www.datpiff.com/'
    },
        "http://www.datpiff.com/Casino-G-100-Grand-On-Da-Table-Chopper-By-The-Door-mixtape.698416.html",
        "http://www.datpiff.com/Cheeze-SWC-Still-Wit-Coke-mixtape.694346.html"
    ]

};