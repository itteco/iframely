module.exports = {

    getLink: function(meta) {

        return {
            href: meta.video_src,
            type: meta.video_type,
            rel: CONFIG.R.player,
            "aspect-ratio": meta.video_width / meta.video_height
        };
    }
};