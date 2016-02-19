module.exports = {

    re: [
        /^https:?\/\/w\.soundcloud\.com\/player\/?\?\/?url=(https:\/\/api\.soundcloud\.com\/tracks\/\d+)$/i
    ],

    getLink: function(urlMatch, cb) {

        cb ({
            redirect: urlMatch[1]
        });
    },

    tests: [{
        noFeeds: true,
      
    },
        "https://w.soundcloud.com/player/?/url=https://api.soundcloud.com/tracks/212506132"
    ]
};