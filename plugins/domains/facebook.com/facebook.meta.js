import * as entities from 'entities';

export default {

    re: [
        'facebook.post',
        'facebook.video'
    ],

    mixins: [
        "domain-icon",
        "oembed-site"
    ],

    getMeta: function(__allowFBThumbnail, meta) {
        return {
            title: meta.twitter?.title || meta.og?.title,
            description: meta.twitter?.description || meta.og?.description,
            canonical: meta.og?.url
        }
    },

    tests: [{
        noFeeds: true
    }]
};