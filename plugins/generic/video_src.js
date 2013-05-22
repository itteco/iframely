module.exports = {

    getLink: function(meta) {

        return {
            href: meta.video_src,
            type: meta.video_type,
            rel: CONFIG.R.player,
            width: meta.video_width,
            height: meta.video_height
        };
    }
};