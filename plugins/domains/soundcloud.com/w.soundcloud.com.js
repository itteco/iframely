const URL = require('url');

module.exports = {

    re: [
        /^https:?\/\/w\.soundcloud\.com\/player\/?\?/i,
        /^https:?\/\/m\.soundcloud\.com\//i
    ],

    getData: function(url, cb) {

        var query = URL.parse(url, true).query;
        var mobileCanonical = url.replace(/^https:?\/\/m\./, 'https://');

        cb ({redirect: query && query.url ? decodeURIComponent(query.url) : mobileCanonical});
    },

    tests: [{
        noFeeds: true,
        },
        // https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/282055227%3Fsecret_token%3Ds-Ct4TV&color=00cc11&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false
        // https://m.soundcloud.com/luke_kelvin_music/leak-lady-gaga-i-wanna-be-with-you
        // https://w.soundcloud.com/player?auto_play=false&origin=twitter&show_artwork=true&url=https%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F349557245&visual=true
        // tests don't pass due to redirect anyway
    ]
};