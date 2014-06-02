module.exports = {

    re: [
        /^https?:\/\/video\.mit\.edu\/watch\/[a-zA-Z\-]+\-(\d+)/i
    ],

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "keywords",
        "og-site",
        "og-title"
    ],

    getLink: function(urlMatch) {

        //http://video.mit.edu/embed/10231/
        return {
            href: "http://video.mit.edu/embed/" + urlMatch[1] + "/",
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 640 / 360
        };
    },

    tests: [
        "http://video.mit.edu/watch/martin-luther-king-jr-breakfast-highlights-10231/"
    ]
};