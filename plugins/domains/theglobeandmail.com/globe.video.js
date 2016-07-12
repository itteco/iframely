module.exports = {

    re: [
        /^https?:\/\/www\.theglobeandmail\.com\/[a-z\/\-]+video\/video+/i,
        /^https?:\/\/www\.theglobeandmail\.com\/[a-z\-]+\/video\/[a-z\-]+\/article\d+/i,
        /^https?:\/\/www\.theglobeandmail\.com\/video\//i
    ],

    mixins: [
        "*"
    ],

    getLink: function(meta) {

        return {
            href: meta["canonical"] + "?videoembed=true",
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            width: 480,
            height: 375,
            scrolling: 'no'
        };
    },

    tests: [
        "http://www.theglobeandmail.com/report-on-business/video/carrick-talks-money-the-dark-side-to-credit-card-rewards/article27604463/",
        "http://www.theglobeandmail.com/video/globe-now/video-globe-now-exploding-whale-ontario-election-dogecoin/article18394260/",
        "http://www.theglobeandmail.com/report-on-business/video/video-market-view-canadas-wild-weather-how-much-will-it-cost-consumers/article16325843/",
        "http://www.theglobeandmail.com//report-on-business/video/video-porters-toronto-island-airport-expansion-will-not-proceed-transport-minister/article27248915/?cmpid=rss1&click=sf_globe"
    ]
};