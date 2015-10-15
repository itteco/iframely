module.exports = {

    re: /^http:\/\/www\.dispatch\.com\/content\/pages\/video\.html\?video=\/videos\/\d+\/\d+\/\d+\/.+/i,

    mixins: ["*"],

    getLink: function(og) {
        return {
            href: og.video.url,
            type: CONFIG.T.flash,
            rel: CONFIG.R.player,
            "aspect-ratio": 620/390
        };
    },

    tests: [{
        noFeeds: true
    },
        "http://www.dispatch.com/content/pages/video.html?video=/videos/2015/08/17/911-call-man-on-fire.xml&cmpid=share",
        "http://www.dispatch.com/content/pages/video.html?video=/videos/2015/10/12/ohio-state-football--both-qbs-make-top-marks.xml&cmpid=share"
    ]

};