module.exports = {

    re: [
        /^https:?\/\/w\.soundcloud\.com\/player\/?\?\/?url=(https:\/\/api\.soundcloud\.com\/tracks\/\d+)$/i
    ],

    getData: function(urlMatch, cb) {

        cb ({
            redirect: urlMatch[1]
        });
    },

    tests: [{
        noFeeds: true,
      
    },
        // "https://w.soundcloud.com/player/?/url=https://api.soundcloud.com/tracks/212506132"
        // test doesn't pass due to redirect anyway
    ]
};