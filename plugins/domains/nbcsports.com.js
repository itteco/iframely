export default {

    provides: '__allowEmbedURL',

    re: [
        /^https?:\/\/www\.nbcsports\.com\/watch?\/[a-zA-Z0-9-]+/i
    ],

    mixins: [
        "*"
    ],

    getData: function(__allowEmbedURL) {        
        return {
            schemaVideoObject: ld.VideoObject
        };
    },

    getLink: function(ld, schemaVideoObject) {

        if (ld.VideoObject) {

            return {
                href: schemaVideoObject.contenturl,
                rel: CONFIG.R.player,
                accept: CONFIG.T.video_mp4,
                "aspect-ratio": 16/9,
            };
        }
    },

    tests: [
        "https://www.nbcsports.com/watch/golf/golf-channel-podcast/scottie-scheffler-rory-mcilroy-among-popular-2024-masters-tournament-picks",
        "https://www.nbcsports.com/watch/nfl/profootballtalk/arrest-warrant-issued-for-rashee-rice-who-faces-eight-charges-for-crash"
    ]
};