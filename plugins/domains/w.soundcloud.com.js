module.exports = {

    re: [
        /^https:?\/\/w\.soundcloud\.com\/player\/?\?\/?(?:visual=true&)?url=([^&]+)/i        
    ],

    getData: function(urlMatch, cb) {

        cb ({
            redirect: decodeURIComponent(urlMatch[1])
        });
    },

    tests: [{
        noFeeds: true,
      
    },
        // "https://w.soundcloud.com/player/?/url=https://api.soundcloud.com/tracks/212506132"
        // "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/282055227%3Fsecret_token%3Ds-Ct4TV&color=00cc11&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false"    
        // test doesn't pass due to redirect anyway
    ]
};