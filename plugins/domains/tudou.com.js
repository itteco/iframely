module.exports = {

    re: [
        /^http:\/\/www\.tudou\.com\/\w+\/([\w_-]+)\/([\w_-]+)\.html/i,
        /^http:\/\/www\.tudou\.com\/programs\/view\/([\w_-]+)/i
    ],

    mixins: [
        "favicon",
        "description",
        "keywords",
        "html-title"
    ],

    getLink: function(urlMatch) {

        var params = urlMatch[2] ? 'type=1&code=' + urlMatch[2] + '&lcode=' + urlMatch[1] : 'type=0&code=' + urlMatch[1] + '&lcode='

        return {
            href: 'http://www.tudou.com/programs/view/html5embed.action?' + params,
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 16/9
        };
    },

    tests: [{
        page: 'http://www.tudou.com/',
        selector: '.pic a',
        getUrl: function(url) {
            return !/^https?:\/\/v\.youku\.com\//i.test(url);            
        }

    },
        "http://www.tudou.com/listplay/Jy6tBwii48M/xLShdaQMhrU.html",
        "http://www.tudou.com/programs/view/F5gcdUclwFo"
    ]
};

