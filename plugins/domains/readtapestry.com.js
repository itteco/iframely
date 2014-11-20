module.exports = {

    re: /https?:\/\/readtapestry\.com\/s\/(\w+)\//i,

    mixins: [
        "canonical",
        "twitter-title",
        "twitter-description",
        "twitter-author",

        "favicon",
        "og-image"
    ],

    getMeta: function() {
        return {
            site: "Tapestry"
        };
    },

    getLink: function(urlMatch) {
        return {
            href: "http://cdn.readtapestry.com/stories/" + urlMatch[1] + "/index.html",
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 852/480
        };
    },

    tests: [
        "https://readtapestry.com/s/fw8tybQBW/",
        "https://readtapestry.com/s/mFEMLp7Iq/"
    ]
};