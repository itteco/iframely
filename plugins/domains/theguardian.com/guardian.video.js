module.exports = {

    re: /http:\/\/www\.theguardian\.com\/\w+\/video\/\d+\/\w+\/\d+\/[\w-]+/i,

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

    getLink: function(meta) {

        // Only "World news" has embedable videos.
        if (meta.video && meta.video.tag && meta.video.tag.indexOf("World news") > -1) {
            return {
                href: "http://embedded-video.guardianapps.co.uk/?a=false&u=" + meta["content-id"],
                type: CONFIG.T.text_html,
                rel: CONFIG.R.player,
                "aspect-ratio": 460 / 397
            };
        }

    },

    tests: [{
        pageWithFeed: "http://www.guardian.co.uk/world/world+content/video"
    },
        "http://www.guardian.co.uk/world/video/2013/jun/26/julia-gillard-ousted-prime-minister-video"
    ]
};