var _ = require('underscore');

var res = [
    /^https?:\/\/v\.qq\.com\/page\/\w\/\w\/\w\/(\w+)\.html$/i,
    /^https?:\/\/v\.qq\.com\/\w+\/page\/(\w+)\.html$/i,
    /^https?:\/\/v\.qq\.com\/\w+\/\w\/\w+\.html\?vid=(\w+)$/i,
    /^https?:\/\/v\.qq\.com\/iframe\/(?:player|preview)\.html\?vid=(\w+)/i    
];

module.exports = {

    re: res,

    mixins: [
        "*"
    ],    

    getLinks: function(urlMatch) {
        
        return [{
                href: "https://v.qq.com/iframe/player.html?vid=" + urlMatch[1] + '&auto=0',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5]
                // "aspect-ratio": 4/3 // use default aspect instead
            }, {
                href: "https://v.qq.com/iframe/player.html?vid=" + urlMatch[1] + '&auto=1',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.autoplay]
                // "aspect-ratio": 4/3 // use default aspect instead
            }];
    },

    tests: [{
        page: "http://v.qq.com/index.html",
        selector: "a.figure",
        getUrl: function(url) {
            return _.find(res, function(r) {
                return url.match(r);
            }) && url;
        }
    }]
};