module.exports = {

    re: /^https?:\/\/www\.cbsnews\.com\/videos\/([^\/\?]+)\/?/i,

    mixins: ["*"],

    getLink: function(urlMatch) {

        // http://www.cbsnews.com/embed/videos/jacob-wetterlings-mother-speaks-out-after-danny-heinrich-confesses-to-murder

        return {
            href: 'http://www.cbsnews.com/embed/videos/' + urlMatch[1],
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.autoplay],
            'aspect-ratio': 640 / 360,
            'max-width': 640
        };
    },

    tests: [{
        feed: 'http://www.cbsnews.com/latest/rss/video'
    },
        "http://www.cbsnews.com/videos/hurricane-katrina-photographer-new-orleans-on-road-to-recovery/",
        "http://www.cbsnews.com/videos/jacob-wetterlings-mother-speaks-out-after-danny-heinrich-confesses-to-murder"
    ]

};