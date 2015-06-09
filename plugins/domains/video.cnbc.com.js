module.exports = {

    re: [
        /^https?:\/\/video\.cnbc\.com\/gallery\/\?video=(\d+)/i
    ],

    mixins: [
        "*"
    ],

    getLink: function(urlMatch) {

        return {
            href: "http://player.cnbc.com/cnbc_global?playertype=synd&byGuid=" + urlMatch[1],
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 530 / 298
        };
    },

    tests: [
        "http://video.cnbc.com/gallery/?video=3000362508"
    ]
};