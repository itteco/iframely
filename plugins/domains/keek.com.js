module.exports = {

    re: [
        /https?:\/\/(?:www\.)?keek\.com\/(?:[a-zA-Z0-9]+\/)?keek\/([a-zA-Z0-9]+)/i
    ],

    getMeta: function(urlMatch) {

        return {
            title: "Keek " + urlMatch[1],
            duration: 36,  // ;D
        };
    },


    getLink: function(urlMatch) {

        return {
            href: "//www.keek.com/embed/" + urlMatch[1],
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 480 / 390
        };
    },

    tests: [
        "https://www.keek.com/JesseWellens/keek/ZFH3aab",
        "https://www.keek.com/keek/ZFH3aab"
    ]
};