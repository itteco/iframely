module.exports = {

    mixins: [
        "canonical",
        "og-site",
        "og-title",
        "og-image",
        "twitter-author",
        "favicon"
    ],

    getLink: function (meta) {

        if (meta.twitter.image) return {
            href: meta.twitter.image.url,
            type: CONFIG.T.image,
            rel: CONFIG.R.image,
            width: meta.twitter.image.width,
            height: meta.twitter.image.height
        }
    },

    tests: [ 
        "http://twitpic.com/8kors1"
    ]
};