module.exports = {

    re: [
        /^https?:\/\/live\.huffingtonpost\.com\/r\/archive\/segment\/[\w-]+\/(\w+)/i,
        /^https?:\/\/live\.huffingtonpost\.com\/r\/segment\/[\w-]+\/(\w+)/i,
        /^https?:\/\/live\.huffingtonpost\.com\/r\/segment\/(\w+)/i
    ],

    mixins: [
        "keywords",
        "twitter-title",
        "twitter-image"
    ],

    getLinks: function(urlMatch) {
        return [{
            href: 'http://live.huffingtonpost.com/images/hufflive_favicon.ico',
            rel: CONFIG.R.icon,
            type: CONFIG.T.icon
        }, {
            href: 'http://embed.live.huffingtonpost.com/HPLEmbedPlayer/?segmentId=' + urlMatch[1],
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            "aspect-ratio": 480/270
        }, {
            href: 'https://s.embed.live.huffingtonpost.com/HPLEmbedPlayer/?segmentId=' + urlMatch[1],
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            "aspect-ratio": 480/270
        }];
    },

    tests: [{
        page: "http://www.huffingtonpost.com/",
        selector: '.tn-hp-live a'
    },
        "http://live.huffingtonpost.com/r/archive/segment/some-straight-men-are-attracted-to-men/51fa762478c90a12d0000469"
    ]

};