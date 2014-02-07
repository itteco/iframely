module.exports = {
  
    re: [
        /^http:\/\/www\.reuters\.com\/video\/\d{4}\/\d{2}\/\d{2}\/[a-zA-Z0-9\-]+\?videoId=(\d+)/i
    ],

    mixins: [
        "favicon",
        "canonical",
        "description",
        "meta-title",
        "keywords"
    ],

    getLink: function (urlMatch) {

        return {
            href: "http://www.reuters.com/resources_v2/flash/video_embed.swf?videoId=" + urlMatch[1] + "&edition=BETAUS",
            rel: CONFIG.R.player,
            type: CONFIG.T.flash,
            "aspect-ratio": 460/259
        }
    },

    tests: [
        "http://www.reuters.com/video/2014/01/10/russian-cossacks-patrol-sochi-prior-to-o?videoId=276394330"
    ]
};