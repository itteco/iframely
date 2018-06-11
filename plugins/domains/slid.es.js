module.exports = {
    re: [
        /^https?:\/\/slides\.com\/([a-zA-Z0-9_\-]+)\/([a-zA-Z0-9_\-]+)/i
    ],

    mixins: [
        "*"
    ],

    getLink: function(urlMatch) {

        return {
            href: urlMatch[0].replace('http://', '//') + "/embed",
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 640 / 360
        };
    },


    tests: [
        "http://slides.com/timkindberg/ui-router"
    ]
};
