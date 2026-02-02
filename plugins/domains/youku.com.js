export default {

    re: [
        /^https?:\/\/v\.youku\.com\/v_show\/id_([a-z0-9=_]{3,})\.html/i
    ],

    mixins: ["*"],

    getLink: function (urlMatch) {
        return {
            href: "https://player.youku.com/embed/"+ urlMatch[1],
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 16/10 //As stated it in docs
        }
    },

    tests: [
        "https://v.youku.com/v_show/id_XNDkwNjg2NzQw.html?f=18736842",
        "https://v.youku.com/v_show/id_XMTY4NDYyMTQ2OA==.html?f=27354669&from=y1.2-3.4.15#paction",
        "https://v.youku.com/v_show/id_XNDgxNTEzNzk5Mg==.html",
        "https://v.youku.com/v_show/id_XNDgxNTEzNzk5Mg==.html"
    ]
};