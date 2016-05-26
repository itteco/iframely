var _ = require('underscore');

var res = [
    /^https?:\/\/v\.qq\.com\/page\/\w\/\w\/\w\/(\w+)\.html$/i,
    /^https?:\/\/v\.qq\.com\/\w+\/page\/\w\/\w\/\w\/(\w+)\.html$/i,
    /^https?:\/\/v\.qq\.com\/\w+\/\w\/\w+\.html\?vid=(\w+)$/i
];

module.exports = {

    re: res,

    mixins: [
        "favicon",
        "author",
        "canonical",
        "description",
        "keywords",
        "html-title"
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
        page: "http://v.qq.com/index.html",
        selector: "a.figure",
        getUrl: function(url) {
            return _.find(res, function(r) {
                return url.match(r);
            }) && url;
        }
    }, {
        skipMixins: ['canonical', 'description', 'keywords']
    },
        "http://v.qq.com/boke/page/j/5/7/j0115mhkc57.html"
    ]
};