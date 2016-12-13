module.exports = {

    re: [
        /^https?:\/\/www\.foxsports\.com\/(?:\w+\/)?video\/?\?vid=(\d+)/i,
        /^https?:\/\/www\.foxsports\.com\/(?:\w+\/)?video\/[a-zA-Z-]+\-()/i        
    ],

    mixins: [
        "*"
    ],    

    getLink: function(urlMatch, cheerio) {

        var $el = cheerio('.platformPlayer');
        var player = JSON.parse($el.attr('data-player-config'));

        if (player.share_embed && player.releaseURL) {
            return {
                href: '//player.foxfdm.com/sports/embed-iframe.html?videourl=' + player.releaseURL +'&autoplay=false',
                rel: [CONFIG.R.player, CONFIG.R.html5],
                type: CONFIG.T.text_html,
                'aspect-ratio': 640 / 360
            }
        }
    },

    tests: [ 
        "http://www.foxsports.com/video?vid=551579203750",
        "http://www.foxsports.com/mlb/video?vid=602673731627",
        "http://www.foxsports.com/mlb/video/scherzer-harper-mock-papelbon-incident-with-handshake-100115?utm_medium=twitter&utm_source=twitterfeed"
    ]
};
