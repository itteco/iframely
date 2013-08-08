module.exports = {

    re: /https:\/\/mixbit\.com\/v\/(\w+)/i,

    getMeta: function() {
        return {
            title: "MixBit",
            site: "MixBit"
        };
    },

    getLink: function(urlMatch) {
        return [{
            href: "https://mixbit.com/favicon.ico",
            type: CONFIG.T.image_icon,
            rel: CONFIG.R.icon
        }, {
            href: "https://mixbit.com/embed/" + urlMatch[1],
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 640/360
        }];
    },

    tests: [{
        noFeeds: true
    },
        "https://mixbit.com/v/_KoIPSHoobOao45Bsy8qWM",
        "https://mixbit.com/v/_4okZTAsQnkchEV5dap0Ei"
    ]
};