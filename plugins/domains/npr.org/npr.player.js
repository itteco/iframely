module.exports = {

    re: [
        /^https?:\/\/www\.npr\.org\/player\/v2\/mediaPlayer\.html\?(?:[^&]+&)*id=(\d+)&m=(\d+)/i,
        /^https?:\/\/www\.npr\.org\/player\/embed\/(\d+)\/(\d+)/i
    ],

    mixins: ["*"],

    getLink: function(urlMatch) {

        return {
                href: "http://www.npr.org/player/embed/" + urlMatch[1] + "/" + urlMatch[2],
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.app],
                height: 290,
                'max-width': 800
            };
    },

    tests: [
        "http://www.npr.org/player/v2/mediaPlayer.html?action=1&t=1&islist=false&id=368714299&m=368931763",
        "http://www.npr.org/player/embed/473953959/473993224"
    ]
};