module.exports = {

    re: /http:\/\/www\.trutv\.com\/(shows\/[\w-]+\/videos\/[\w-]+)\.html/i,

    mixins: [
        "og-title",
        "og-description",

        "favicon",
        "og-image"
    ],

    getMeta: function() {
        return {
            site: "trutv.com"
        }
    },

    getLink: function(urlMatch) {

        return {
            href: "http://i.cdn.turner.com/trutv/trutv.com/video/cvp/v2/assets/trutv_embed_container.swf?site=tru&context=embed&profile=6&contentId=" + urlMatch[1],
            type: CONFIG.T.flash,
            rel: CONFIG.R.player,
            "aspect-ratio": 608 / 372
        };
    },

    tests: [{
        page: "http://www.trutv.com/shows/worlds-dumbest/videos/index.html",
        selector: ".video-play.fill"
    },
        "http://www.trutv.com/shows/worlds-dumbest/videos/bike-jump-fails.html"
    ]
};