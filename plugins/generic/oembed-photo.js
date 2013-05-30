module.exports = {

    getLink: function(oembed) {

        if (oembed.type != "photo") {
            return;
        }

        return {
            href: oembed.url,
            type: CONFIG.T.image,
            rel: [CONFIG.R.image, CONFIG.R.oembed],
            width: oembed.width,
            height: oembed.height
        };
    }
};