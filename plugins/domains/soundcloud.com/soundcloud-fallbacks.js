module.exports = {

    provides: ['sound_count'],

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
    },

    getData: function(__allow_soundcloud_meta, meta) {
        return {
            sound_count: meta.soundcloud && meta.soundcloud.sound_count !== undefined ? meta.soundcloud.sound_count : 1
        }
    }

};