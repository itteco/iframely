module.exports = {

    getLinks: function(og, whitelistRecord) {

        if (og.video) {

        //if (og.video && whitelistRecord.isAllowed && whitelistRecord.isAllowed('og.video')) {

            var players = [{
                href: og.video.url || og.video,
                type: og.video.type || CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.og],
                width: og.video.width,
                height: og.video.height
            }]

            if (whitelistRecord && whitelistRecord.isAllowed('og.video', 'ssl')) {
                players.push({
                    href: og.video.secure_url,
                    type: og.video.type || CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.og],
                    width: og.video.width,
                    height: og.video.height
                })
            }
        
            return players;
        }
    }
};