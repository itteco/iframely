module.exports = {

    re: /^https?:\/\/link\.brightcove\.com\/services\/player\//i,

    mixins: [
        "twitter-title",
        "twitter-description",
        "twitter-image"
    ],

    getLink: function(twitter) {        

        // Make Brightcove consistently autoplay. It depends on customer settings and we can not make them all NOT to autoplay - so the only way out is to autoplay them all.

        if (twitter.player) {
            var player = twitter.player.value || twitter.player;
            player = player.indexOf("autoStart") > -1 ? player.replace(/autoStart=false/, "autoStart=true") : player + "&autoStart=true"

            return {
                href: player,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.ssl, CONFIG.R.autoplay],
                'aspect-ratio': twitter.player.width / twitter.player.height
            };
        }
    },

    tests: [
        "https://link.brightcove.com/services/player/bcpid3151725071001?bckey=AQ~~,AAAACEcotwk~,gYcGnPAbE5Ck3BRhnuzIUQ5FzKM7PVaV&bctid=4432841078001&secureConnections=true&secureHTMLConnections=true&linkSrc=twitter&autoStart=false&height=100%25&width=100%25",
        "https://link.brightcove.com/services/player/bcpid1638546175001?bckey=AQ~~,AAAAmtVJIFk~,TVGOQ5ZTwJZhmi7steBjnvKikk1S5nut&bctid=2587584769001&secureConnections=true&secureHTMLConnections=true&linkSrc=twitter&autoStart=false&height=100%25&width=100%25",
        "https://link.brightcove.com/services/player/bcpid616303324001?bckey=AQ~~,AAAAj36EGjE~,w53r2XdUtII0XxxdqYeLp1bOxUXrsIg0&bctid=620166577001&secureConnections=true&secureHTMLConnections=true&linkSrc=twitter&autoStart=false&height=100%25&width=100%25"
    ]
};