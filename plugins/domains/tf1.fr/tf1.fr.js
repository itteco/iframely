module.exports = {

	re: [
		/^https?:\/\/www\.tf1\.fr\/\w{3,4}\//i
	],

    provides: "watID",

    mixins: [
        "*"
    ],

    getData: function(urlMatch, cheerio) {


        var $player = cheerio('.iframe_player[data-src*="wat.tv/embedframe/"], .lazyloadPlayer[data-html*="wat.tv/embedframe/"]');

        if ($player.length) {
                
            var src = $player.attr('data-src') || $player.attr('data-html');
            
            return {
                watID: src.match(/wat\.tv\/embedframe\/([a-zA-Z0-9_\-]+)/i)[1]
            }
        }

    },

    tests: [
        "https://www.tf1.fr/nt1/la-villa-des-coeurs-brises/news/gabano-nadege-j-ai-l-impression-de-me-taper-pote-2692850.html",
        "https://www.tf1.fr/nt1/la-villa-des-coeurs-brises/videos/gabano-jesseka-bisou-piscine-1.html"
    ]
};