module.exports = {

    getLink: function (meta, whitelistRecord) {

        if (meta.video_src && whitelistRecord.isAllowed && whitelistRecord.isAllowed('html-meta.video')) {
        
            var player = {
                href: meta.video_src.href || meta.video_src,
                accept: [CONFIG.T.text_html, CONFIG.T.flash, 'video/*'],
                rel: [CONFIG.R.player]
            };

            if (whitelistRecord.isAllowed('html-meta.video', 'responsive')) {
                player['aspect-ratio'] = meta.video_width / meta.video_height;                
            } else {
                player.width = meta.video_width;
                player.height = meta.video_height;
            }

            if (whitelistRecord.isAllowed('html-meta.video', CONFIG.R.html5)) {
                player.rel.push(CONFIG.R.html5);
            }

            if (whitelistRecord.isAllowed('html-meta.video', CONFIG.R.autoplay)) {
                player.rel.push(CONFIG.R.autoplay);
            }

            return player;
        }
    }
};