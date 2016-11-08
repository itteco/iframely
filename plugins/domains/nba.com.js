module.exports = {

    provides: '__allowEmbedURL',

    re: [
        /^https?:\/\/www\.nba\.com\/video\//i
    ],    

    getData: function(urlMatch) {        
        return {
            __allowEmbedURL: true
        };
    },

    mixins: [
        "*"
    ],

    getLink: function(schemaVideoObject) {

        if (schemaVideoObject.contentURL || schemaVideoObject.contentUrl) {

            return {
                href: schemaVideoObject.contentURL || schemaVideoObject.contentUrl,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                type: CONFIG.T.maybe_text_html
                // "aspect-ratio": use default
            };
        }
    },

    tests: [
        "http://www.nba.com/video/games/sixers/2015/04/15/0021401227-mia-phi-play1.nba/",
        "http://www.nba.com/video/channels/tnt_overtime/2015/10/07/nba-on-tnt-the-quest-cavs.nba/"
    ]
};