module.exports = {

    mixins: [
        "*"
    ],

    getLink: function (twitter) {
        if (twitter.player && twitter.player.value && twitter.player.width && twitter.player.height) {
            return {
                href: twitter.player.value + (twitter.player.value.indexOf('?') > -1 ? '&': '?') + 'format=embed&autoplay=false',
                accept: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                autoplay: 'autoplay=true',
                "aspect-ratio": twitter.player.width / twitter.player.height
            };
        }
    },

    tests: [
        "https://api.momindum.com/watch/uD3ia9PaDspTqG0A-XUJKWix70GEd-1dHPge8cngPAU"
    ]

};