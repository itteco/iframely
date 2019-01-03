module.exports = {

    re: [
        /https?:.*\.momindum\.com/i,
        /https?:\/\/momindum\.com/i
    ],

    mixins: [
        "*"
    ],

    getLink: function (twitter) {
        if (twitter.card == 'player' ) {
            return {
                href: (twitter.player.value || twitter.player) + '?format=embed',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": twitter.player.width / twitter.player.height
            };
        }
    },

    tests: [
        "https://api.momindum.com/watch/uD3ia9PaDspTqG0A-XUJKWix70GEd-1dHPge8cngPAU"
    ]

};