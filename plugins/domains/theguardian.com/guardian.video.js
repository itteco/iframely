export default {

    re: /https?:\/\/www\.theguardian\.com\/[\w-]+\/video\/\d+\/\w+\/\d+\/[\w-]+/i,

    mixins: [
        "*"
    ],

    getLink: function(og, cheerio) {

        var video = og.video && (og.video.url || og.video.secure_url);

        if (video) {

            // exclude embedded YouTubes
            var $embed = cheerio('video[data-embeddable="true"]');
            if ($embed.length === 1) {

                return {
                    href: video.replace(/https?:\/\/www\.theguardian\.com\//, "https://embed.theguardian.com/embed/video/"),
                    type: CONFIG.T.text_html,
                    rel: CONFIG.R.player,
                    "aspect-ratio": 560 / 315
                };
            }
        }

    },

    tests: [
        // https://www.theguardian.com/world/video/2017/oct/19/honoured-and-privileged-jacinda-ardern-on-being-new-zealands-next-pm-video
        "http://www.theguardian.com/world/video/2013/jun/26/julia-gillard-ousted-prime-minister-video",
        "http://www.theguardian.com/tv-and-radio/video/2014/may/14/russian-mp-sings-protest-austria-conchita-wurst-eurovision-video"
    ]
};