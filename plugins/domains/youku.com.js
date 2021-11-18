module.exports = {

    //http://v.youku.com/v_show/id_XNDkwNjg2NzQw.html?f=18736842
    re: [
        /^https?:\/\/v\.youku\.com\/v_show\/id_([a-z0-9=_]{3,})\.html/i,
        /^https?:\/\/news\.youku\.com\/(\w{3,})/i
    ],

    mixins: ["*"],

    getLink: function (urlMatch) {
        return {
            href: "https://player.youku.com/embed/"+ urlMatch[1],
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 16/10, //As stated it in docs
            autoplay: "autoplay=true"
        }
    },

    tests: [{
        page: "http://www.youku.com/",
        selector: ".common_container .pack_pack_cover a"
    },
        "http://v.youku.com/v_show/id_XNDkwNjg2NzQw.html?f=18736842",
        "http://v.youku.com/v_show/id_XMTY4NDYyMTQ2OA==.html?f=27354669&from=y1.2-3.4.15#paction",
        "https://v.youku.com/v_show/id_XNDgxNTEzNzk5Mg==.html",
        "https://v.youku.com/v_show/id_XNDgxNTEzNzk5Mg==.html"

    ]
};