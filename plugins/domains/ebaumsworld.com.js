module.exports = {

    re: [
        /^https?:\/\/www\.ebaumsworld\.com\/video\/watch\/(\d+)/i,
        /^https?:\/\/www\.ebaumsworld\.com\/videos\/[a-zA-Z0-9_-]+\/(\d+)/i
    ],

    mixins: ["*"],

    getLink: function(urlMatch) {

        //http://www.ebaumsworld.com/media/embed/81387150
        return {
            href: "http://www.ebaumsworld.com/media/embed/" + urlMatch[1],
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 567 / 345
        };
    },

    tests: [{
        page: "http://www.ebaumsworld.com/videos/",
        selector: ".title a"
    },
        "http://www.ebaumsworld.com/video/watch/81387150/"
    ]
};