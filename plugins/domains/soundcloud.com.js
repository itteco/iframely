module.exports = {

    mixins: [
        "og-title",
        "og-image"
    ],

    getLink: function(meta) {

        var link = {
            href: meta.og.video.url,
            type: meta.og.video.type,
            rel: [CONFIG.R.player, CONFIG.R.og]
        };

        // Single track.
        if (meta.og.video.height < 100) {
            link.height = 82;
        } else {
            link["aspect-ratio"] = meta.og.video.width / meta.og.video.height;
        }

        return link;
    }

};
