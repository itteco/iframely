module.exports = {

    getLink: function(meta, whitelistRecord) {

        if (!meta.twitter || !meta.twitter.image)
            return;

        var rel;

        if (whitelistRecord.isAllowed('twitter.photo')) {
            rel = CONFIG.R.image;
        } else {
            rel = CONFIG.R.thumbnail;
        }

        return {
            href: meta.twitter.image.url || meta.twitter.image.src || meta.twitter.image,
            type: CONFIG.T.image,
            rel: [rel, CONFIG.R.twitter],
            width: meta.twitter.image.width,
            height: meta.twitter.image.height
        };
    }
};