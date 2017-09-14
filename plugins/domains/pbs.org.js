module.exports = {

    //http://video.pbs.org/video/1863101157/    
    re: [
        /^https?:\/\/www\.pbs\.org\/video\/(\d+)\//i,
        /^https?:\/\/www\.pbs\.org\/video\/([a-zA-Z0-9\-]+)\//i,        
        /^https?:\/\/video\.pbs|[a-zA-Z]+\.org\/video\/(\d{8,12})\/?$/i // + Powered by PBS
    ],

    mixins: ["*"],

    getLink: function (urlMatch, meta) {

        if (!meta.twitter || meta.twitter.site !== "@PBS") {
            return;
        }

        var vid = /^\d+$/.test(urlMatch[1]) ? urlMatch[1] : 
            (meta.og && /^https?:\/\/www\.pbs\.org\/video\/(\d+)\//i.test(meta.og.url) ?
            meta.og.url.match(/^https?:\/\/www\.pbs\.org\/video\/(\d+)\//i)[1] : null);

        if (vid) {        
            return {
                href: "//player.pbs.org/viralplayer/" + vid, 
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 16/9,
                "padding-bottom": 90,
                "max-width": 953
            }
        }
    },

    tests: [
        "http://video.pbs.org/video/1863101157/",
        "http://www.pbs.org/video/frontline-college-inc/",
        "http://video.wmht.org/video/2365159854/",
        "http://video.valleypbs.org/video/2365156636/",
        "http://video.indianapublicmedia.org/video/2365148408/",
        "http://video.wbgu.org/video/2365157614/",
        "http://video.netnebraska.org/video/2365109484/",
        "http://video.unctv.org/video/2365160248/",
        "http://video.tpt.org/video/2365150373/"
        // beware http://mediamatters.org/video/2016/06/09/nbc-nightly-news-highlights-usa-today-report-trump-s-history-ripping-his-workers/210849
    ]
};