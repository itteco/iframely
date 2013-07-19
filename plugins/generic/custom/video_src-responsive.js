module.exports = {

    getLink: function(meta) {

        return {
            href: meta.video_src,
            type: meta.video_type,
            rel: [CONFIG.R.player, CONFIG.R.iframely],
            "aspect-ratio": meta.video_width / meta.video_height
        };
    }
};