module.exports = {

    // direct "share" links to players from DailyMail articles. They end with #v-1467332342001
    re: [        
        /https?:\/\/www\.dailymail\.co\.uk\/[^#]+#(v\-\d+)$/i
    ],

    provides: 'dailymailVideoID',

    mixins: ['favicon'],

    getData: function(urlMatch) {
        
        return {
            dailymailVideoID: urlMatch[1]
        }        
    },    

    tests: [{
        noFeeds: true
    },
        "https://www.dailymail.co.uk/tvshowbiz/article-2885993/A-look-unconventional-13-year-relationship-Helena-Bonham-Carter-Tim-Burton-movies-made.html#v-1467332342001",
        "https://www.dailymail.co.uk/news/article-3556177/Was-MH17-shot-Ukrainian-fighter-jet-BBC-documentary-claims-Boeing-777-targeted-plane.html#v-8296301435444282732"
    ]
};