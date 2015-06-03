module.exports = {

    re: [
        /^https?:\/\/www\.56\.com\/\w{3}\/v_([a-zA-Z0-9]+).html/i,
        /^https?:\/\/www\.56\.com\/\w{3}\/play_[a-zA-Z0-9\-]+_vid\-([a-zA-Z0-9]+).html/i
    ],

    getLink: function(urlMatch) {

        return {
                href: "http://www.56.com/iframe/" + urlMatch[1],
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 480 / 405
            };
    },

    tests: [
        "http://www.56.com/u38/v_MTAxODk4MjE5.html",
        "http://www.56.com/u45/v_MTAwNTk3MjM0.html",
        "http://www.56.com/w76/play_album-aid-12208640_vid-MTA2MzQ4NDkz.html"
    ]
};