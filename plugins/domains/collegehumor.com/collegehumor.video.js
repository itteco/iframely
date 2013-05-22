module.exports = {

    mixins: [
        "og-title",
        "og-image"
    ],

    getLinks: function(meta) {
        return [{
            href: meta.og.video.url.replace(/auto=true/, "auto=false"),
            type: meta.og.video.type,
            rel: CONFIG.R.player,
            "aspect-ratio": meta.og.video.width / meta.og.video.height
        }, {
            href: meta.og.video.secure_url.replace(/auto=true/, "auto=false"),
            type: meta.og.video.type,
            rel: CONFIG.R.player,
            "aspect-ratio": meta.og.video.width / meta.og.video.height
        }];
    },

    tests: [{
        pageWithFeed: "http://www.collegehumor.com/videos"
    },
        "http://www.collegehumor.com/video/6853117/look-at-this-instagram-nickelback-parody"
    ]
};