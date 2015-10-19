module.exports = {

    getLink: function (meta, whitelistRecord) {

        if (meta.video_src && whitelistRecord.isAllowed && whitelistRecord.isAllowed('html-meta.video')) {
        
            var player = {
                href: meta.video_src.href || meta.video_src,
                type: meta.video_type || CONFIG.T.maybe_text_html,
                rel: CONFIG.R.player
            };

            if (whitelistRecord.isAllowed('html-meta.video', 'responsive')) {
                player['aspect-ratio'] = meta.video_width / meta.video_height;                
            } else {
                player.width = meta.video_width;
                player.height = meta.video_height;
            }

            return player;
        }
    }
};