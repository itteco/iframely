import facebook_video_re from './facebook.video.js';

export default {

    re: facebook_video_re.re,

    getMeta: function(__allowFBThumbnail, schemaVideoObject) {

        return {
            duration: schemaVideoObject.duration.replace(/^T/, 'PT'),
            date: schemaVideoObject.datepublished,
            views: schemaVideoObject.interactioncount
        }
    },

    getLink: function(__allowFBThumbnail, schemaVideoObject) {

        if (schemaVideoObject
            && schemaVideoObject['@type'] === 'VideoObject'
            && schemaVideoObject.thumbnail
            && schemaVideoObject.thumbnail.contenturl
        ) {
            return {
                href: schemaVideoObject.thumbnail.contenturl,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
            }
        }
    },

    tests: [
        "https://www.facebook.com/video.php?v=4392385966850",
        {noFeeds: true}, {skipMixins: ["fb-error"]}
    ]
};