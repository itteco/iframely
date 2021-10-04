module.exports = {

    re: [
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/([a-zA-Z0-9_]+)(?:\?parent=.*)?$/i,
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/[a-zA-Z0-9_]+\/video\/(\d+)/i,
    ],

    mixins: [
        "*"
    ],

    provides: ['schemaVideoObject'],    

    getData: function (meta, url, cb) {
        if (!meta.og || !meta.og.video) {
            cb (null, {
                __appFlag: true
            });
        } else if (!meta.ld || !meta.ld.schemaVideoObject) {
            var embedURL = /\/video\/(\d+)/i.test(url)
                ? `https://player.twitch.tv/?video=${url.match(/\/video\/(\d+)/i)[1]}&autoplay=false`
                : meta.og && meta.og.video && meta.og.video.secure_url && meta.og.video.secure_url.replace('&player=facebook', '');

            cb(null, {
                schemaVideoObject: {
                    embedURL: embedURL
                }
            });
        } else {
            cb(null, null);
        }
    },

    tests: [{
        noFeeds: true, skipMethods: ["getData"]
    },
        "https://www.twitch.tv/ninja",
        "https://www.twitch.tv/starcraft/video/520219960"
    ]
};