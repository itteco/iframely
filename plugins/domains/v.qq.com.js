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
            rel: [CONFIG.R.player, CONFIG.R.iframely],
            'aspect-ratio': 16/9,
            'padding-bottom': 50,
            autoplay: 'autoplay=true'
        };
    },

    tests: [
        "https://v.qq.com/x/cover/mzc00200xxpsogl/j4101ouc4ve.html",
        "https://v.qq.com/x/cover/qab156ofmrj45xy/r0025sd3txm.html",
        "https://v.qq.com/x/page/h0305y9ksmw.html",
        "https://v.qq.com/x/page/d3237p2gogi.html",
        "https://v.qq.com/page/z/5/3/z01698x4h53.html",
        "https://v.qq.com/page/o/p/p/o0196h1eppp.html",
        "https://v.qq.com/boke/page/a/0/5/a031175aee5.html",
        "http://v.qq.com/boke/page/f/3/p/f0188kmbq3p.html"
    ]
};