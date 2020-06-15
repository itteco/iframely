module.exports = {

    re: [
        /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/([a-zA-Z0-9_]+)$/i
    ],

    mixins: [
        "*"
    ],

    // Players return 404 errors on HEAD requests as of June 5, 2020. 
    // So need to bypass a validation in a plugin.
    getLink: function(og) {
        if (og.video) {
            return {
                href: og.video.secure_url,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                'aspect-ratio': 16/9,
                autoplay: 'autoplay=true'
            }
        }
    },    

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