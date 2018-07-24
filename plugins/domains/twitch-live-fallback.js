module.exports = {

    re: [
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/([a-zA-Z0-9_]+)$/i
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
            cb();
        }
    },

    tests: [{
        noFeeds: true, skipMethods: ["getData"]
    },
        "https://www.twitch.tv/ninja"
    ]
};