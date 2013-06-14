module.exports = {

    mixins: [
        "og-image",
        "twitter-player-responsive",
        "video-duration",
        "og-title",
        "og-site",
        "canonical",
        "favicon"
    ],

    getMeta: function (meta) {
        var date_descr = meta.og.description; // "Video recorded with Socialcam on April 01, 2012"

        if (!date_descr) return;

        return {
            date: date_descr.split(' on ')[1]
        }

    },

    tests: [
        "http://socialcam.com/v/9gBTI4QZ?twitter=true"
    ]


};
