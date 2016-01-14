module.exports = {

	re: [
		/^https?:\/\/www\.nbcsports\.com\/videos?\/[a-zA-Z0-9-]+/i
	],

    mixins: [
        "*"
    ],

    getLink: function(twitter) {

        if (twitter.player) {

            return {
                href: twitter.player.stream.value || twitter.player.stream,
                type: CONFIG.T.maybe_text_html, // verify, it is likely a text/html rather than mp4
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 16 / 9 // twitter.player width & height are incorrect
            }
        }
    },

    tests: [
        "http://www.nbcsports.com/video/redskins-team-beat-wild-card-matchup-vs-packers"
    ]
};