module.exports = {

    // direct "share" links to players from DailyMail articles. They end with #v-1467332342001
    re: [        
        /https?:\/\/www\.dailymail\.co\.uk\/[^#]+#(v\-\d+)$/i
    ],

    provides: 'dailymailVideo',

    mixins: [
        "domain-icon"
    ],

    getData: function(urlMatch, cheerio) {

        var $player = cheerio('#' + urlMatch[1] + ' video[data-opts]');
        
        if ($player.length) {
            return {
                dailymailVideo: JSON.parse($player.attr('data-opts'))
            }
        }
    },

    getMeta: function(dailymailVideo) {
        return {
            title: dailymailVideo.title, 
            description: dailymailVideo.descr
        }
    },

    getLinks: function(dailymailVideo) {

        return [{
            href: dailymailVideo.poster || dailymailVideo.thumbnail,
            type: CONFIG.T.image,
            rel: CONFIG.R.thumbnail
        }, {
            // if something is undefined - let getLinks fail to fall back to default parsers
            href: dailymailVideo.plugins['social-share'].embedUrl, // no SSL
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,             
            "aspect-ratio": 484 / 282, // taken from mp4 aspect
            "padding-bottom": 50 + 50 + 50
        }];
    },    

    tests: [
        "http://www.dailymail.co.uk/tvshowbiz/article-2885993/A-look-unconventional-13-year-relationship-Helena-Bonham-Carter-Tim-Burton-movies-made.html#v-1467332342001"
    ]
};