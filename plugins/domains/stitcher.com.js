module.exports = {

    // No regexps here. We'll let it fall back to generic parsers, if no podcast is detected.

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "keywords",
        "og-title"
    ],

    getLinks: function(og) {

        var episode = og.url && og.url.match(/^https?:\/\/www\.stitcher\.com\/s\?eid=(\d+)/i);
        var station = og.image && (og.image.value || og.image).match(/_(\d+)\.jpg$/i);

        if (!episode || !station) return; // so it falls back to generic parsers

        return {
            href: "https://app.stitcher.com/splayer/f/" + station[1] + "/" + episode[1] + "?refId=iframely",
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 400 / 400
        };
    },

    tests: [{
        noFeeds: true
    },
        "http://www.stitcher.com/s?eid=35290263",
        "http://www.stitcher.com/podcast/nodeup/episode/35312671?refid=stpr&autoplay=true"
    ]
};