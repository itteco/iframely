module.exports = {

    getLink: function(meta) {

        if (!meta.twitter || !meta.twitter.image)
            return;

        return {
            href: meta.twitter.image.url || meta.twitter.image.src || meta.twitter.image,
            type: CONFIG.T.image,
            rel: [CONFIG.R.image, CONFIG.R.twitter],
            width: meta.twitter.image.width,
            height: meta.twitter.image.height
        };
    }
};