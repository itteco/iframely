module.exports = {

    re: /^https?:\/\/(?:www\.)?bet\.com\/videos?\//i,

    mixins: [
        "*"
    ],

    getLink: function(og) {

        if (og.video && og.video.url) {
                
            return {
                href: og.video.url.replace(/\.share\.height\-\d+\.width\-\d+\.html$/, '.share.responsive-true.html'),
                rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.autoplay],
                type: CONFIG.T.text_html,
                "aspect-ratio": 16/9
            }
        }
    },

    tests: [{
        noFeeds: true
    },
        "http://www.bet.com/video/hiphopawards/2016/cyphers/kur-dave-east-young-m-a-sam-black-ms-jade.html",
        "http://www.bet.com/video/106andpark/highlights/mack-wilds-106-and-park-3449.html"
    ]
};