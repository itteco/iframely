module.exports = {

    re: [
        /^https?:\/\/www\.myvideo\.de\/watch\/([0-9]+)/i,
        /^https?:\/\/www\.myvideo\.de[\/a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+\-m\-(\d+)/i
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
        "http://www.myvideo.de/watch/9790416/Balbina_Seife_feat_Maeckes",
        "http://www.myvideo.de/filme/cristiano-ronaldo-feet-m-11870130",
        "http://www.myvideo.de/serien/zoo/highlights/preview-folge-9-gefahr-droht-oben-m-12145697"
    ]
};