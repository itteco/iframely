module.exports = {

    re: /^https:\/\/500px\.com\/photo.+/,

    mixins: [
        "twitter-title",
        "oembed-author",
        "oembed-thumbnail",
        "oembed-site",
        "og-image-rel-image",
        "og-description",
        "canonical",
        "keywords"
    ],

    getMeta: function(meta) {

        var keywords = meta.five_hundred_pixels.tags;
        if (keywords instanceof Array) {
            keywords = meta.five_hundred_pixels.tags.join(', ');
        }

        return {
            latitude: meta.five_hundred_pixels.location.latitude,
            longitude: meta.five_hundred_pixels.location.longitude,
            category: meta.five_hundred_pixels.category,
            date: meta.five_hundred_pixels.uploaded,
            keywords: keywords
        };
    },

    getLinks: function(meta) {
        return {
            href: meta["shortcut icon"].href,
            type: CONFIG.T.image_icon,
            rel: CONFIG.R.icon,
            width: 32,
            height: 32
        }
    },

    tests: [{
        pageWithFeed: "https://500px.com/flow"
    },
        "http://500px.com/photo/13541787?from=upcoming"
    ]
};