export default {

    provides: ['sound'],

    lowestPriority: true,

    getMeta: function(__allow_soundcloud_meta, og, oembed) {
        return {
            title: !!oembed.title ? '' : og.title, // fix for Test suite, otherwise if og title = oembed title, tests fail because "oembed-title" did not return any data, or so it says.
            site: !!oembed.provider_name ? '' : og.site_name,
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