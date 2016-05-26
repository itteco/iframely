module.exports = {

    re: /https?:\/\/www\.theguardian\.com\/[\w-]+\/video\/\d+\/\w+\/\d+\/[\w-]+/i,

    mixins: [
        "*"
    ],

    getLink: function(og) {

        var video = og.video && (og.video.url || og.video.secure_url);

        if (video) {

            return {
                href: video.replace(/https?:\/\/www\.theguardian\.com\//, "https://embed.theguardian.com/embed/video/"),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 560 / 315
            };
        }

    },

    tests: [
        "http://www.theguardian.com/world/video/2013/jun/26/julia-gillard-ousted-prime-minister-video",
        "http://www.theguardian.com/tv-and-radio/video/2014/may/14/russian-mp-sings-protest-austria-conchita-wurst-eurovision-video"
    ]
};