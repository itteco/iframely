module.exports = {

    re: [        
        /https?:\/\/[\w\.]+yahoo\.com\//i
    ],

    mixins: ["*"],

    highestPriority: true,

    getMeta: function(twitter) {

        if (twitter.card == 'player') {

            return {
                media: "player"
            }
        }
    },    

    getLinks: function(twitter) {

        if (twitter.card == 'player' && !/\?format=embed$/i.test(twitter.player.value || twitter.player)) {

            return {
                href: (twitter.player.value || twitter.player) + '?format=embed',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player,  CONFIG.R.html5],
                "aspect-ratio": twitter.player.width / twitter.player.height
            }
        }
    },

    tests: [
        "https://ca.news.yahoo.com/video/unicorn-leads-california-highway-patrol-134024517.html",
        "https://uk.news.yahoo.com/video/cctv-shows-london-thieves-moped-164116329.html",
        "https://br.noticias.yahoo.com/video/colombiano-cria-biblioteca-com-livros-173319839.html",
        "https://screen.yahoo.com/miles-ahead-clip-gone-153000608.html",
        "https://movies.yahoo.com/video/crimson-peak-clip-proper-welcome-153000548.html"
    ]
};