export default {

    re: [
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/([a-zA-Z0-9_]+)(?:\?parent=.*)?$/i,
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/(?:[a-zA-Z0-9_]+\/)?videos?\/(\d+)/i,
    ],

    mixins: [
        "*"
    ],

    provides: ['schemaVideoObject'],    

    getData: function (meta, url, cb) {

        if (meta.og && meta.og.video && (!meta.ld || !meta.ld.videoobject)) {
            var embedURL = /\/video\/(\d+)/i.test(url)
                ? `https://player.twitch.tv/?video=${url.match(/\/video\/(\d+)/i)[1]}&autoplay=false`
                : meta.og && meta.og.video && meta.og.video.secure_url && meta.og.video.secure_url.replace('&player=facebook', '');

            return cb(null, {
                schemaVideoObject: {
                    embedURL: embedURL
                }
            });

        } else if (!meta.ld && meta.twitter && meta.twitter.title === 'Twitch'
            && /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/(?:[a-zA-Z0-9_]+\/)?videos?\/(\d+)/i) {

            return cb({
                responseStatusCode: 404
            });

        } else {
            cb(null, null);
        }
    },

    tests: [{
        noFeeds: true, skipMethods: ["getData"]
    },
        "https://www.twitch.tv/ninja",
        "https://www.twitch.tv/videos/520219960",
        "https://www.twitch.tv/videos/2118598830"
    ]
};