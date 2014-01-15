module.exports = {

    re: [
        /^http:\/\/www\.theglobeandmail\.com\/[a-z\/\-]+video\/video+/
    ],

    mixins: [
        "favicon",
        "canonical",
        "og-description",
        "keywords",
        "og-site",
        "og-title"
    ],

    getLink: function(meta) {
        console.log("i was here");

        return {
            href: meta["canonical"] + "?videoembed=true",
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            width: 480,
            height: 345
        };
    },

    tests: [
        "http://www.theglobeandmail.com/sports/sports-video/video-rodman-dont-give-us-negativity-for-n-korea/article16230684/",
        "http://www.theglobeandmail.com/report-on-business/video/video-market-view-canadas-wild-weather-how-much-will-it-cost-consumers/article16325843/"
    ]
};