module.exports = {

    re: /^http:\/\/www\.tudou\.com\/\w+\/([\w_-]+)\/([\w_-]+)\.html/i,

    mixins: [
        "favicon",
        "description",
        "keywords",
        "html-title"
    ],

    getLink: function(urlMatch) {
        return {
            href: 'http://www.tudou.com/programs/view/html5embed.action?type=1&code=' + urlMatch[2] + '&lcode=' + urlMatch[1],
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 16/9
        };
    },

    tests: [{
        page: 'http://www.tudou.com/',
        selector: '.pic a'
    },
        "http://www.tudou.com/listplay/Jy6tBwii48M/xLShdaQMhrU.html"
    ]
};

