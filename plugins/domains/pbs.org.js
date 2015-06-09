module.exports = {

    //http://video.pbs.org/video/1863101157/    
    re: [
        /^https?:\/\/video\.(pbs|[a-zA-Z]+)\.org\/video\/(\d+)\//i // + Powered by PBS
    ],

    mixins: ["*"],

    getLink: function (urlMatch, meta) {

        if (!meta.twitter || !meta.twitter.site === "@PBS") {
            return;
        }

        // http://video.pbs.org/viralplayer/1863101157
        return {
            href: "http://video."+ urlMatch[1] +".org/viralplayer/"+ urlMatch[2],
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 512/376
        };
    },

    tests: [
        "http://video.pbs.org/video/1863101157/",
        "http://video.wmht.org/video/2365159854/",
        "http://video.valleypbs.org/video/2365156636/",
        "http://video.indianapublicmedia.org/video/2365148408/",
        "http://video.wbgu.org/video/2365157614/",
        "http://video.netnebraska.org/video/2365109484/",
        "http://video.unctv.org/video/2365160248/",
        "http://video.tpt.org/video/2365150373/"
    ]
};