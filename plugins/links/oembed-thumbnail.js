module.exports = {

    getLink: function(oembed) {
        return {
            href: oembed.thumbnail_url,
            type: CONFIG.T.image,
            rel: [CONFIG.R.thumbnail, CONFIG.R.oembed],
            width: oembed.thumbnail_width,
            height: oembed.thumbnail_height
        };
    }
};