module.exports = {

    re: [
        /^https?:\/\/v\.qq\.com\/page\/\w\/\w\/\w\/(\w+)\.html$/i,
        /^https?:\/\/v\.qq\.com\/\w+\/page\/\w\/\w\/\w\/(\w+)\.html$/i,
        /^https?:\/\/v\.qq\.com\/\w+\/\w\/\w+\.html\?vid=(\w+)$/i
    ],

    mixins: [
        "html-title",

        "favicon"
    ],

    getLinks: function(urlMatch) {
        return [
            {
                href: "http://static.video.qq.com/TPout.swf?vid=" + urlMatch[1],
                type: CONFIG.T.flash,
                rel: CONFIG.R.player,
                "aspect-ratio": 4/3
            }
        ];
    },

    tests: [{
        page: "http://v.qq.com/games/list/501_50101/0/1_0.html",
        selector: "a.mod_poster_160"
    },
        "http://v.qq.com/boke/page/j/5/7/j0115mhkc57.html"
    ]
};