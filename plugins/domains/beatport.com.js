module.exports = {

    re: [
        /^https?:\/\/(?:www|mixes|pro)\.beatport\.com\/(track|mix)\/[a-zA-Z0-9\.\-]+\/(\d+)/i
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

    getLink: function(og, urlMatch) {
        return [{
            href: "http://embed.beatport.com/player/?id=" + urlMatch[2] + "&type=" + urlMatch[1],
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            height: og.video && og.video.height || 162,
            'min-width': og.video && og.video.width || 398
        }, {
            href: og.video && og.video.secure_url.replace(/(auto)=1/i, '$1=0'),
            type: og.video && og.video.type || CONFIG.T.text_html,
            rel: CONFIG.R.player,
            height: og.video && og.video.height,
            'min-width': og.video && og.video.width
        }];
    },

    tests: [{
        page: "http://www.beatport.com/",
        selector: "a.itemRenderer-title"
    }, {
        skipMixins: [
            "author",
            "canonical",
            "copyright",
            "og-site",
            "og-description"
        ]
    },
        "http://www.beatport.com/track/kiss-bitches-original-mix/5374571",
        "http://mixes.beatport.com/mix/happy-ch-electro-pop-vol-006/163618",
        "http://mixes.beatport.com/mix/winter-mixtape/120091"
    ]
};