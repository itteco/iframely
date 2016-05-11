module.exports = {

    re: [
        /^https?:\/\/www\.twitch\.tv\/([a-zA-Z0-9_]+)$/i
    ],

    mixins: [
        "*"
    ],

    getLink: function (urlMatch, og) {

        if (og.video && og.video.secure_url) {
            return {
                href: "//player.twitch.tv/?channel=" + urlMatch[1],
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.autoplay, CONFIG.R.html5],
                "aspect-ratio": og.video.width / og.video.height
            };
        }
    },

    tests: [
        "https://www.twitch.tv/imaqtpie",
        "http://www.twitch.tv/adultswim"
    ]
};