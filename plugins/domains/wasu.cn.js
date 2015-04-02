module.exports = {

    re: /^http:\/\/www\.wasu\.cn\/Play\/\w+\/id\/(\d+)/i,

    mixins: [
        "favicon",
        "author",
        "description",
        "keywords",
        "meta-title"
    ],

    getLink: function(urlMatch) {
        return {
            href: 'http://www.wasu.cn/Play/iframe/id/' + urlMatch[1],
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            'apsect-ratio': 1.2
        };
    },

    tests: [{
        page: 'http://www.wasu.cn/',
        selector: '.block a'
    },
        'http://www.wasu.cn/Play/show/id/5039416'
    ]
};