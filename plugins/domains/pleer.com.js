module.exports = {

    re: [
        /^https?:\/\/(?:pleer|prostopleer)\.com\/tracks\/([a-zA-Z0-9]+)/i,
        /^https?:\/\/embed\.(?:pleer|prostopleer)\.com\/track\?id=([a-zA-Z0-9]+)/i
    ],

    // no mixins or parsing of the page - it will time-out in most cases
    // besides, meta doesn't contain much anyway.

    mixins: false,

    getMeta: function (urlMatch) {
        return {
            title: "ProstoPleer track " + urlMatch[1]
        }

    },

    getLink: function(urlMatch) {
        return {
            href: "http://embed.pleer.com/track?id=" + urlMatch[1] + '&for=iframely',
            type: CONFIG.T.flash,
            rel: CONFIG.R.player,
            height: 42
        }
    },

    tests: [
        "http://pleer.com/tracks/11252650NyAZ",
        "http://embed.pleer.com/track?id=B6p6lmB5rxpzuBt1s"
    ]
};