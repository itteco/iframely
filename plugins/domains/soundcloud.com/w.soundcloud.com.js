const URL = require('url');

module.exports = {

    re: [
        /^https:?\/\/w\.soundcloud\.com\/player\/?\?/i
    ],

    getData: function(url, meta, options, cb) {

        var canonical = meta.canonical;
        var noRedirectYet = !options.redirectsHistory || options.redirectsHistory.indexOf(canonical) === -1;

        cb (noRedirectYet ? {redirect: canonical} : null);
    },

    tests: [{
        noFeeds: true,
        },
        "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/282055227%3Fsecret_token%3Ds-Ct4TV&color=00cc11&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false",
        "https://w.soundcloud.com/player?auto_play=false&origin=twitter&show_artwork=true&url=https%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F349557245&visual=true"
    ]
};