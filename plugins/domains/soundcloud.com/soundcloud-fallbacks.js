module.exports = {

    provides: ['sound'],

    lowestPriority: true,

    getMeta: function(__allow_soundcloud_meta, og) {
        return {
            title: og.title,
            site: og.site_name,
            description: og.description
        }
    },

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
            sound: {
                count: meta.soundcloud && meta.soundcloud.sound_count !== undefined ? meta.soundcloud.sound_count : 1,
                thumbnail: {
                    url: meta.og && meta.og.image && meta.og.image.url,
                    width: meta.og && meta.og.image && meta.og.image.width,
                    width: meta.og && meta.og.image && meta.og.image.height
                }
            }
        }
    }

};