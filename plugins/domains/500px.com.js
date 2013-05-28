module.exports = {

    mixins: [
        "og-title",
        "oembed-author",
        "oembed-site",
        "description",
        "oembed-thumbnail",
        "favicon",
        "canonical",
        "twitter-image-rel-image"
    ],

    getMeta: function(meta) {
        return {
            latitude: meta.five_hundred_pixels.location.latitude,
            longitude: meta.five_hundred_pixels.location.longitude,
            category: meta.five_hundred_pixels.category,
            date: meta.five_hundred_pixels.uploaded,
            keywords: meta.five_hundred_pixels.tags && meta.five_hundred_pixels.tags.join(', ')
        };
    },

    tests: [{
        page: "http://500px.com/upcoming",
        selector: ".title a"
    },
        "http://500px.com/photo/13541787?from=upcoming"
    ]
};