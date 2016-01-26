module.exports = {

    re: [
        /^https?:\/\/www\.myvideo\.de\/watch\/([0-9]+)/i
        // the rest should be covered by whitelist via embedURL - it verifies permissions etc
    ],

    mixins: ["*"],

    getLink: function (urlMatch) {

        return {
            href: "http://www.myvideo.de/embedded/public/"+ urlMatch[1],
            type: CONFIG.T.text_html,            
            rel: CONFIG.R.player,
            "aspect-ratio": 611 / 383,
            "min-width": 425
        }
    },

    tests: [
        "http://www.myvideo.de/watch/9790416/Balbina_Seife_feat_Maeckes"
    ]
};