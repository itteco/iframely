module.exports = {

    mixins: [
        "canonical",
        "oembed-site",
        "oembed-author",
        "favicon"
    ],

    getMeta: function(oembed) {
        return {
            title: oembed.title.split(/[\.\r\n]/)[0],
            description: oembed.title
        };
    },

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
        pageWithFeed: "http://www.smugmug.com/popular/today"
    },
        "http://www.smugmug.com/popular/all#!i=789708429&k=sPdffjw",
        {
        skipMixins: [
            "og-title",
            "oembed-title",
            "canonical"
        ]
    }]
};