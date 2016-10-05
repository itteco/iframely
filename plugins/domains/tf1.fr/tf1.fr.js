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
        "http://www.tf1.fr/tf1/secret-story/news/entre-melanie-bastien-rien-ne-va-plus-3194547.html",
        "http://www.tf1.fr/tf1/secret-story/videos/secret-story-10-anais-deja-nerfs.html",
        "http://www.tf1.fr/xtra/en-coloc/videos/episode-3-repas-de-famille.html",
        "http://www.tf1.fr/tf1/telefilms/videos/patricia-cornwell-trompe-l-oeil.html",
        "http://www.tf1.fr/nt1/telefilms-fictions/videos/j-ai-change-destin.html"
    ]
};