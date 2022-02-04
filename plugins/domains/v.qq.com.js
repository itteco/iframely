const re = [
    /^https?:\/\/v\.qq\.com\/page\/\w\/\w\/\w\/(\w+)\.html$/i,
    /^https?:\/\/v\.qq\.com\/\w+\/page\/(\w+)\.html$/i,
    /^https?:\/\/v\.qq\.com\/\w+\/\w\/\w+\.html\?vid=(\w+)$/i,
    /^https?:\/\/v\.qq\.com\/iframe\/(?:player|preview)\.html\?vid=(\w+)/i,
    /^https?:\/\/v\.qq\.com\/\w\/cover\/\w+\/(\w+)\.html/i
];

export default {

    re: re,

    mixins: ["*"],
    
    getLinks: function(url, urlMatch) {
        return {
            href: "https://v.qq.com/txp/iframe/player.html?vid=" + urlMatch[1],
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.iframely],
            'aspect-ratio': 16/9,
            'padding-bottom': 50,
            autoplay: 'autoplay=true'
        };
    },

    tests: [{
        page: "http://v.qq.com/index.html",
        selector: "a.figure",
        getUrl: function(url) {
            return re.some((r) => r.test(url));
        }
    }]
};