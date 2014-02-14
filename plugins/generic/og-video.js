module.exports = {

    getLinks: function(meta, whitelistRecord) {

        if (meta.og && meta.og.video && whitelistRecord.isAllowed && whitelistRecord.isAllowed('og.video')) {

            var players = [{
                href: meta.og.video.url || meta.og.video,
                type: meta.og.video.type || CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.og],
                width: meta.og.video.width,
                height: meta.og.video.height
            }];

            if (whitelistRecord.isAllowed('og.video', 'ssl')) {
                players.push({
                    href: meta.og.video.secure_url,
                    type: meta.og.video.type || CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.og],
                    width: meta.og.video.width,
                    height: meta.og.video.height
                });
            }
        
            return players;
        }
    }
};