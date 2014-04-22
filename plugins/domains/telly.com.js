module.exports = {

    re: /^https?:\/\/telly\.com\/(\w+)$/i,

    //twitvid will re-direct here
    //TODO: extract YouTube & Vimeo players
    mixins: [
        "canonical",
        "og-site",
        "og-title",
        "twitter-image",
        "favicon"
    ],

    getLink: function(urlMatch, meta) {
        return {
            href: "https://telly.com/embed.php?guid=" + urlMatch[1] + "&autoplay=0",
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 480/360
        };
    },

    tests: [
        "http://telly.com/Q84DI7",
        "http://telly.com/1AUHUCN"
    ]
};