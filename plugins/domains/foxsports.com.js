module.exports = {

    re: [
        /^https?:\/\/www\.foxsports\.com\/video\/?\?vid=(\d+)/i
    ],

    mixins: [
        "*"
    ],    

    getLink: function(urlMatch, cheerio) {

        var $el = cheerio('.platformPlayer');
        var player = JSON.parse($el.attr('data-player-config'));

        if (player.share_embed && player.releaseURL) {
            return {
                href: '//player.foxfdm.com/sports/embed-iframe.html?videourl=' + player.releaseURL,
                rel: [CONFIG.R.player, CONFIG.R.autoplay, CONFIG.R.html5],
                type: CONFIG.T.text_html,
                'aspect-ratio': 640 / 360
            }
        }
    },

    tests: [ 
        "http://www.foxsports.com/video?vid=551579203750"
    ]
};
