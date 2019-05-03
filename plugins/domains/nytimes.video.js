module.exports = {

    re: [
        /^https?:\/\/www\.nytimes\.com\/video\/[a-zA-Z0-9\-]+\/(\d+)\//,
        /^https?:\/\/www\.nytimes\.com\/video\/\w+\/\w+\/(\d+)\//
    ],

    mixins: [
        "*"
    ],

    getLink: function(meta, urlMatch) {

        if (meta.medium == "video") {
            return {
                href: "https://www.nytimes.com/video/players/offsite/index.html?videoId=" + urlMatch[1],
                accept: CONFIG.T.text_html, // may return X-Frame-Options at the moment. Check it.                
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 16/9,
                "padding-bottom": 71 + 1
            }
        }
    },

    tests: [
        "http://www.nytimes.com/video/movies/100000002478606/anatomy-of-a-scene-gravity.html?smid=nytimesarts",
        "http://www.nytimes.com/video/nyregion/100000003880254/a-complicated-love-story.html?playlistId=1194811622241",
        "http://www.nytimes.com/video/realestate/100000003852081/block-by-block-hoboken.html?playlistId=1194811622241",
        "http://www.nytimes.com/video/world/middleeast/100000004055530/turkey-footage-shows-plane-blast.html",
        "http://www.nytimes.com/video/us/100000004255656/the-terminator-and-the-washing-machine.html?smid=tw-share",
        "http://www.nytimes.com/video/t-magazine/100000004528545/on-set-natalie-portman.html?smid=pl-share"
    ]
};