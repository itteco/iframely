module.exports = {

    // No regexps here. We'll let it fall back to generic parsers, if no podcast is detected.

    provides: "__stitcherEpisode",

    mixins: [
        "*"
    ],

    getLinks: function(__stitcherEpisode, cheerio) {

        var $listenLater = cheerio('#listenLater[data-eid="'+ __stitcherEpisode +'"]');

        if ($listenLater.length && $listenLater.attr('data-fid')) {
            return {
                href: "https://app.stitcher.com/splayer/f/" + $listenLater.attr('data-fid') + "/" + __stitcherEpisode,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                height: 220
                //"aspect-ratio": 220 / 150
            };
        }
    },

    getData: function (og) {
        var episode = og.url && og.url.match(/^https?:\/\/www\.stitcher\.com\/s\?eid=(\d+)/i);

        if (!episode) {
            return;
        } else {
            return {
                __stitcherEpisode: episode[1]
            }
        }
    },    

    tests: [{
        noFeeds: true
    },
        "http://www.stitcher.com/s?eid=35290263",
        "http://www.stitcher.com/podcast/nodeup/episode/35312671?refid=stpr&autoplay=true",
        "http://www.stitcher.com/podcast/twit/the-new-screen-savers/e/tnss-49-from-russia-with-code-43809567"
    ]
};