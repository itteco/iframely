module.exports = {

    getLink: function(__allow_soundcloud_meta, og) {        
        if (og.image && og.image.url) {
            return {
                href: og.image.url,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail,
                width: og.image.width,
                height: og.image.height
            }
        }
    }

};