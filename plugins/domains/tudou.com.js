module.exports = {

    re: [
        /^http:\/\/www\.tudou\.com\/\w+\/([\w_-]+)\/([\w_-]+)\.html/i,
        /^http:\/\/www\.tudou\.com\/programs\/view\/([\w_-]+)\//i
    ],

    mixins: [
        "favicon",
        "description",
        "keywords",
        "html-title"
    ],

    getLink: function(urlMatch) {

        var href;

        if (urlMatch[2]) {
            href = 'http://www.tudou.com/programs/view/html5embed.action?type=1&code=' + urlMatch[2] + '&lcode=' + urlMatch[1];
        } else {
            href = 'http://www.tudou.com/programs/view/html5embed.action?type=0&code=' + urlMatch[1] + '&lcode=&resourceId=0_06_05_99';
        }

        return {
            href: href,
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 16/9
        };
    },

    tests: [{
        page: 'http://www.tudou.com/',
        selector: '.pic a'
    },
        "http://www.tudou.com/listplay/Jy6tBwii48M/xLShdaQMhrU.html",
        "http://www.tudou.com/programs/view/966_lDwfam8/"
    ]
};

