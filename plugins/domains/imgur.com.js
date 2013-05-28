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
        if (meta.twitter && meta.twitter.image && (src = meta.twitter.image.url) && src.match(/\.jpg$/)) {
            return {
                href: src.replace(/\.jpg$/, "b.jpeg"),
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