module.exports = {

    mixins: [
        "og-image",
        "favicon",
        "author",
        "canonical",
        "copyright",
        "og-description",
        "og-site",
        "og-title"
    ],

    getLink: function(og) {
        return [{
            href: og.video.url,
            type: og.video.type,
            rel: [CONFIG.R.player, CONFIG.R.og],
            height: og.video.height,
            'min-width': og.video.width
        }, {
            href: og.video.secure_url,
            type: og.video.type,
            rel: [CONFIG.R.player, CONFIG.R.og],
            height: og.video.height,
            'min-width': og.video.width
        }]
    },

    tests: [{
        page: "http://www.beatport.com/",
        selector: "a.itemRenderer-title"
    },
        "http://www.beatport.com/track/jump-original-mix/5463999"
    ]
};