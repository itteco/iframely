module.exports = {

    re: [
        /^https?:\/\/globalnews\.ca\/video\/(\d+)\//i
    ],

    mixins: ["*"],

    getLink: function(urlMatch) {

        return {
                href: "http://globalnews.ca/video/embed/" + urlMatch[1] + "/",
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 670 / 437
            };
    },

    tests: [{
        page: "http://globalnews.ca/national/videos/",
        selector: "a.video-thumb"
    },
        "http://globalnews.ca/video/1915279/red-wings-forward-drew-miller-gets-slashed-in-face-on-ice"
    ]
};