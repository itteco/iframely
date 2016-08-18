module.exports = {

    re: /^https?:\/\/www\.eltiempo\.com\/[\w\-\/]+\/video\/.+/,

    mixins: [
        "*"
    ],

    getLink: function(twitter, cheerio) {

    	if (twitter.player && twitter.player.height && !twitter.player.src) {

	        var $player = cheerio('meta[name="twitter:player"]');

	        if ($player.length) {

	        	return {
	        		href: $player.attr('content'),
	        		type: CONFIG.T.text_html,
	        		rel: [CONFIG.R.player, CONFIG.R.html5],
	        		"aspect-ratio": twitter.player.width / twitter.player.height
	        	}

			}
		}
    },

    tests: [
        "http://www.eltiempo.com/estilo-de-vida/gente/video/jose-gaviria-y-giselle-lacouture-en-hola-colombia/16405473"
    ]
};