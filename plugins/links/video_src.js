module.exports = {

    getLink: function (meta, whitelistRecord) {

        // TODO: remove that.
        //if (!whitelistRecord || (whitelistRecord.isAllowed && whitelistRecord.isAllowed('html-meta.video'))) {
        
            return {
                href: meta.video_src,
                type: meta.video_type || CONFIG.T.text_html,
                rel: CONFIG.R.player,
                width: meta.video_width,
                height: meta.video_height
            };
        //}
    }
};