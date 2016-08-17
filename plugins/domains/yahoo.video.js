module.exports = {

    re: [        
        /https?:\/\/[\w\.]+yahoo\.com\//i
    ],

    mixins: ["*"],

    getMeta: function(twitter) {

        if (twitter.card == 'player') {

            return {
                media: "player"
            };
        }
    },    

    getLink: function(twitter, whitelistRecord) {

        if (twitter.card == 'player' && !(whitelistRecord.isAllowed && whitelistRecord.isAllowed('twitter.player')) ) {

            return {
                href: (twitter.player.value || twitter.player) + '?format=embed',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player,  CONFIG.R.html5],
                "aspect-ratio": twitter.player.width / twitter.player.height
            };
        }
    },

    tests: [
        {
            noFeeds: true,
            skipMethods: ["getLink"] // it's just a backup in case twitter player is broken
        },
        "https://ca.news.yahoo.com/video/unicorn-leads-california-highway-patrol-134024517.html",
        "https://uk.news.yahoo.com/video/cctv-shows-london-thieves-moped-164116329.html",
        "https://br.noticias.yahoo.com/video/colombiano-cria-biblioteca-com-livros-173319839.html",
        "https://screen.yahoo.com/miles-ahead-clip-gone-153000608.html",
        "https://movies.yahoo.com/video/crimson-peak-clip-proper-welcome-153000548.html"
    ]
};