module.exports = {

    //http://v.youku.com/v_show/id_XNDkwNjg2NzQw.html?f=18736842    
    re: [
        /^https?:\/\/v\.youku\.com\/v_show\/id_(\w{3,})\.html/i
    ],

    mixins: [
        "html-title",
        "description",
        "keywords"
    ],

    getLink: function (urlMatch) {

        return {
            href: "http://player.youku.com/embed/"+ urlMatch[1],
            type: CONFIG.T.text_html,            
            rel: CONFIG.R.player,
            "aspect-ratio": 16/10 //As stated it in docs
        }
    },

    tests: [
        "http://v.youku.com/v_show/id_XNDkwNjg2NzQw.html?f=18736842"
    ]
};