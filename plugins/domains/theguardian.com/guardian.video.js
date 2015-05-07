module.exports = {

    re: /https?:\/\/www\.theguardian\.com\/[\w-]+\/video\/\d+\/\w+\/\d+\/[\w-]+/i,

    mixins: [
        "canonical",
        "site",
        "og-title",
        "og-description",
        "video",
        "shortlink",

        "favicon",
        "og-image"
    ],

    getLink: function(og) {

        if (og.type === 'video' && og.video && og.video.url) {

            return {
                href: og.video.url.replace(/https?:\/\/www\.theguardian\.com\//, "https://embed.theguardian.com/embed/video/"),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 560 / 315
            };
        }

    },

    tests: [
        "http://www.guardian.co.uk/world/video/2013/jun/26/julia-gillard-ousted-prime-minister-video",
        "http://www.theguardian.com/tv-and-radio/video/2014/may/14/russian-mp-sings-protest-austria-conchita-wurst-eurovision-video"
    ]
};