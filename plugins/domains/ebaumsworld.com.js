module.exports = {

    re: [
        /^http:\/\/www\.ebaumsworld\.com\/video\/watch\/(\d+)/i
    ],

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "twitter-description",
        "twitter-title"
    ],

    getLink: function(urlMatch) {

        //http://www.ebaumsworld.com/media/embed/81387150
        return {
            href: "http://www.ebaumsworld.com/media/embed/" + urlMatch[1],
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 567 / 345
        };
    },

    tests: [
        "http://www.ebaumsworld.com/video/watch/81387150/"
    ]
};