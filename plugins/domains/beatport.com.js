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
        "description",
        "og-site",
        "og-title"
    ],

    getLink: function(urlMatch) {

        return {
                href: "http://embed.beatport.com/player/?id=" + urlMatch[2] + "&type=" + urlMatch[1],
                type: CONFIG.T.text_html,
                rel: CONFIG.R.player,
                height: 162,
                "max-width": 600
            };
    },

    tests: [
        "http://www.beatport.com/track/kiss-bitches-original-mix/5374571",
        "http://mixes.beatport.com/mix/happy-ch-electro-pop-vol-006/163618",
        "http://mixes.beatport.com/mix/winter-mixtape/120091"
    ]
};