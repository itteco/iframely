module.exports = {

    re: [
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/([a-zA-Z0-9_]+)(?:\?parent=.*)?$/i
    ],

    mixins: [
        "*"
    ],

    getData: function (meta, cb) {

        if (!meta.og || !meta.og.video) {
            cb (null, {
                __appFlag: true
            });
        } else {
            cb(null, {
                schemaVideoObject: {
                    embedURL: meta.og && meta.og.video && meta.og.video.secure_url && meta.og.video.secure_url.replace('&player=facebook', '')
                }
            });
        }
    },

    tests: [{
        noFeeds: true, skipMethods: ["getData"]
    },
        "https://www.twitch.tv/ninja"
    ]
};