module.exports = {

    getLinks: function(meta) {
        return [{
            href: meta.og.video.url || meta.og.video,
            type: meta.og.video.type || CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.og],
            "aspect-ratio": meta.og.video.width / meta.og.video.height
        }, {
            href: meta.og.video.secure_url,
            type: meta.og.video.type || CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.og],
            "aspect-ratio": meta.og.video.width / meta.og.video.height
        }];
    }
};