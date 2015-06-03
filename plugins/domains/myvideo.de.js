module.exports = {

    re: [
        /^https?:\/\/www\.myvideo\.de\/watch\/([0-9]+)/i,
        /^https?:\/\/www\.myvideo\.de\/musik\/\w+\/[\w-]+-([0-9]+)/i
    ],

    mixins: ["*"],

    getLink: function (urlMatch) {

        return {
            href: "https://www.myvideo.de/embed/"+ urlMatch[1],
            type: CONFIG.T.text_html,            
            rel: CONFIG.R.player,
            "aspect-ratio": 611 / 383,
            "min-width": 425
        }
    },

    tests: [{
        page: "http://www.myvideo.de/Top_100/Top_100_Charts",
        selector: ".chartlist--videolist-item-title"
    },
        "http://www.myvideo.de/watch/9790416/Balbina_Seife_feat_Maeckes"
    ]
};