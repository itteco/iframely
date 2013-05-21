module.exports = {

    re: /^http:\/\/www\.justin\.tv\/\w+\/b\/\d+/i,

    mixins: [
        "og-title",
        "image_src"
    ],

    getLink: function(meta) {

        return {
            href: meta.og.video + "&auto_play=false",
            type: meta.video_type,
            rel: CONFIG.R.player,
            "aspect-ratio": meta.video_width / meta.video_height
        };
    },

    tests: [
        "http://www.justin.tv/teamoguatelindatv54/b/402947852"
    ]
};