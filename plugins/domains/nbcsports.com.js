module.exports = {

	re: [
		/^https?:\/\/www\.nbcsports\.com\/videos?\/[a-zA-Z0-9-]+/i
	],

    mixins: [
        "*"
    ],

    getLink: function(twitter, cheerio) {

        if (twitter.player) {

            var $player = cheerio('#vod-player');

            if ($player.length) {
                
                var src = $player.attr('src');
                
                return {
                    href: src.match(/\/\/vplayer\.nbcsports\.com\/p\/[a-zA-Z0-9_]+\/nbcsports\/select\/media\/[a-zA-Z0-9_]+/i)[0],
                    rel: [CONFIG.R.player, CONFIG.R.html5],
                    accept: CONFIG.T.text_html,
                    "aspect-ratio": 16/9,
                    autoplay: 'autoPlay=true'
                }
            }
        }
    },

    tests: [
        "http://www.nbcsports.com/video/redskins-team-beat-wild-card-matchup-vs-packers",
        "http://www.nbcsports.com/video/alex-morgan-scores-opening-12-seconds-vs-costa-rica"
    ]
};