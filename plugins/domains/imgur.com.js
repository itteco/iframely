module.exports = {

    mixins: [
        "twitter-title",
        "description",
        "canonical",
        "keywords",

        "favicon",
        "twitter-image-rel-image"
    ],

    getLink: function(meta) {

        var src;
        if (meta.twitter && meta.twitter.image && (src = meta.twitter.image.url) && src.match(/\.(jpg|png)$/)) {
            return {
                href: src.replace(/\.(jpg|png)$/, "b.$1"),
                rel: CONFIG.R.thumbnail,
                type: CONFIG.T.image_jpeg,
                width: 160,
                height: 160
            };
        }
    },

    tests: [{
        pageWithFeed: "http://imgur.com/"
    },
        "http://imgur.com/Ks3qs"
    ]
};