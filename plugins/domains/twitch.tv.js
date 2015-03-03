module.exports = {

    mixins: [
        "og-image",
        "favicon",
        "og-description",
        "og-site",
        "og-title"
    ],

    getLink: function (og) {

        if (!(og.video && og.video.secure_url)) {
            return;
        }


        return {
            href: og.video.secure_url,
            type: og.video.type,
            rel: [CONFIG.R.player, CONFIG.R.autoplay],
            "aspect-ratio": og.video.width / og.video.height
        };
    }
};