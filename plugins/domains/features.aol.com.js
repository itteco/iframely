module.exports = {

    re: [
        /^https?:\/\/features\.aol\.com\/video\//i        
    ],

    mixins: ["*"],

    getLink: function(cheerio) {

        var $feature = cheerio('.feature-info');
        if ($feature.length) {
            var playlist = $feature.attr('data-playlist');

            if (playlist) {
                return {
                    href: "http://pshared.5min.com/Scripts/PlayerSeed.js?sid=281&playList=" + playlist,
                    type: CONFIG.T.javascript,
                    rel: [CONFIG.R.player,  CONFIG.R.inline, CONFIG.R.html5],
                    "aspect-ratio": 16 / 9

                }
            }
        }
    },

    tests: [
        "http://features.aol.com/video/rescuers-make-shocking-discovery-inside-abandoned-home"
    ]
};