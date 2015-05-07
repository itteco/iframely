module.exports = {

    re: [
        /^https?:\/\/www\.vier\.be\/\w+\/videos\/[a-zA-Z0-9\-]+\/(\d+)/i
    ],

    mixins: [
        "favicon",
        "canonical",
        "og-description",
        "og-image",
        "twitter-site",
        "og-title"    
    ],

    getLinks: function(urlMatch) {

        var id = urlMatch[1];
         
        return {
            href: "http://www.vier.be/video/v3/embed/" + id,
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 800 / 450
        };
    },

    tests: [
        "http://www.vier.be/kroost/videos/ik-word-60000-jaar/815134"
    ]
};