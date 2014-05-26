module.exports = {

    re: [
        /^https?:\/\/(?:www|mixes)\.beatport\.com\/(track|mix)\/[a-zA-Z0-9\.\-]+\/(\d+)/i
    ],

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
            href: og.video.url.replace(/(auto)=1/i, '$1=0'),
            type: og.video.type,
            rel: [CONFIG.R.player, CONFIG.R.og],
            height: og.video.height,
            'min-width': og.video.width
        }, {
            href: og.video.secure_url.replace(/(auto)=1/i, '$1=0'),
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
        "http://www.beatport.com/track/kiss-bitches-original-mix/5374571",
        "http://mixes.beatport.com/mix/happy-ch-electro-pop-vol-006/163618",
        "http://mixes.beatport.com/mix/winter-mixtape/120091"
    ]
};