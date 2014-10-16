module.exports = {

    re: [
        /^https?:\/\/www\.break\.com\/video\//i
    ],    

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-site",
        "twitter-title",
        "twitter-description"
    ],

    getLink: function(meta) {

        if (meta.embed_video_url) {

            return {
                href: meta.embed_video_url,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": meta.embed_video_width / meta.embed_video_height
            }
        }
    },

    tests: [
        "http://www.break.com/video/this-girl-is-not-a-fan-of-litterbugs-2759576"
    ]
};