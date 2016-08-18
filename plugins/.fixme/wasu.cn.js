var re = /^http:\/\/www\.wasu\.cn\/Play\/\w+\/id\/(\d+)/i;

module.exports = {

    re: re,

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
        selector: '.pic_img a',
        getUrl: function(url) {
            if (url.match(re)) return url;
        }
    },
        'http://www.wasu.cn/Play/show/id/7473137'
    ]
};