module.exports = {

    re: [
        /^http:\/\/www\.myvideo\.de\/watch\/([0-9]+)/i
    ],

    mixins: [
        "canonical",
        "og-title",
        "og-site",
        "keywords",

        "og-image",
        "favicon"
    ],

    getLink: function (urlMatch) {

        return {
            href: "https://www.myvideo.de/embed/"+ urlMatch[1],
            type: CONFIG.T.text_html,            
            rel: CONFIG.R.player,
            "aspect-ratio": 611 / 383,
            "min-width": 425,
            "max-width": 611 
        }
    },

    tests: [{
        pageWithFeed: "http://www.myvideo.de/Top_100/Top_100_Charts"
    }]
};