module.exports = {
    re: [
        /https?:.*\.ticker\.tv/i,
        /https?:\/\/ticker\.tv/i
    ],

    mixins: [
        "favicon",
        "description",
        "keywords",
        "html-title"
    ],

    getLink: function (twitter) {
        var src = "http:" + twitter.player;
        return {
            href: src,
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player
        };
    },

    tests: [
        "http://ticker.tv/livetraders/59cac960f7226110604daf97",
        "http://ticker.tv/kevinbantz/59417c3ef72261996765000d",
        "http://ticker.tv/daytradewarrior/56e9be84f722616233abed06"
    ]
};