module.exports = {

    getLinks: function(og) {
        return [{
            href: og.video.url || og.video,
            type: og.video.type || CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.og],
            "aspect-ratio": og.video.width / og.video.height
        }, {
            href: og.video.secure_url,
            type: og.video.type || CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.og],
            "aspect-ratio": og.video.width / og.video.height
        }];
    }
};