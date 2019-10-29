module.exports = {

    re: [
        /^https:?\/\/w\.soundcloud\.com\/player\/?\?\/?(?:visual=true&)?url=([^&]+)/i,
        /^https:?\/\/m\.soundcloud\.com\//i
    ],

    getData: function(url, urlMatch, cb) {

        var redirect = urlMatch[1] ? urlMatch[1] : url.replace(/^https:?\/\/m\./, 'https://');

        cb ({
            redirect: decodeURIComponent(redirect)
        });
    },

    tests: [{
        noFeeds: true,
      
    },
        // https://w.soundcloud.com/player/?/url=https://api.soundcloud.com/tracks/212506132
        // https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/282055227%3Fsecret_token%3Ds-Ct4TV&color=00cc11&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false
        // https://m.soundcloud.com/luke_kelvin_music/leak-lady-gaga-i-wanna-be-with-you
        // test doesn't pass due to redirect anyway
    ]
};