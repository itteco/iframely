export default {

    re: [
        /^https?:\/\/www\.nbcsports\.com\/videos?\/[a-zA-Z0-9-]+/i
    ],

    mixins: [
        "*"
    ],

    getLink: function(twitter, whitelistRecord) {

        if (twitter.player && whitelistRecord.isAllowed('twitter.player')) {
            return {
                href: twitter.player.value,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                accept: CONFIG.T.text_html,
                "aspect-ratio": 16/9,
                autoplay: 'autoPlay=true'
            }
        }
    },

    tests: [
        "https://www.nbcsports.com/video/redskins-team-beat-wild-card-matchup-vs-packers",
        "https://www.nbcsports.com/video/alex-morgan-scores-opening-12-seconds-vs-costa-rica"
    ]
};