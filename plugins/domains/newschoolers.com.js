module.exports = {

    re: /^https?:\/\/www\.newschoolers\.com\/videos?\/watch\/(\d+)\//i,

    mixins: [
        "*"
    ],

    getLink: function(urlMatch) {

        return {
            href: "http://www.newschoolers.com/videoembed/" + urlMatch[1],
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            'aspect-ratio': 720 / 430
        };
    },

    tests: [
        "http://www.newschoolers.com/videos/watch/825222/One-Of-Your-Days---Winner---Carter-Mcmilllan"
    ]

};