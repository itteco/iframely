module.exports = {

    re: [
        /^https?:\/\/video\.pandodaily\.com\/([a-zA-Z0-9]+)\/([a-zA-Z0-9\-]+)/i
    ],    

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "og-site",
        "og-title"
    ],

    getLink: function(urlMatch) {

        return {
            href: "http://video.pandodaily.com/player/" + urlMatch[1],
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 640/360
        };
    },

    tests: [
        "http://video.pandodaily.com/dU5/3-billion-is-the-new-1-billion-on-uber-snapchat-and-spotify/"
    ]
};