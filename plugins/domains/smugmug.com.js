module.exports = {

    mixins: [
        "oembed-title",
        "description",
        "canonical",
        "oembed-site",
        "oembed-author",
        "keywords",
        "favicon"
    ],

    getLink: function (oembed) {

        var size_M_src = oembed.url;
        var size_X_src = size_M_src.replace("/M/", "/X3/");

        return [{
            href: size_M_src,
            type: CONFIG.T.image,
            rel: CONFIG.R.thumbnail,
            width: oembed.width,
            height: oembed.height
        }, {
            href: size_X_src,
            type: CONFIG.T.image,
            rel: CONFIG.R.image
        }]
    },

    tests: [{
        pageWithFeed: "http://www.smugmug.com/popular/all"
    }]
};