module.exports = {

    re: [
        /^https?:\/\/path\.com\/p\/(\w+)/i,
        /^https?:\/\/path\.com\/moment\/(\w+)/i
    ],

    // TODO: better to have 'excludeMixins: ["og-video"]

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "media-detector",
        "twitter-site",
        "og-title"
    ],

    getLink: function(og) {

        if (og.video.secure_url) {

            // og.video broken as [object Object]

            return {
                href: og.video.secure_url,
                type: og.video.type,
                rel: [CONFIG.R.player, CONFIG.R.og],
                width: og.video.width,
                height: og.video.height
            };
        }
    },

    tests: [{
        noFeeds: true,
        skipMethods: ["getLink"],
        skipMixins: ["media-detector"]
    },
        "https://path.com/p/42Sun1",
        "https://path.com/p/2Citrk",
        "https://path.com/p/2XzZcC",
        "https://path.com/p/12tHdu",
        "https://path.com/p/2QsP9k"
    ]
};