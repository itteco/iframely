module.exports = {

    mixins: [
        "og-title",
        "oembed-author",
        "oembed-site",
        "description",
        "oembed-thumbnail",
        "twitter-image"
    ],

    getMeta: function(meta) {
        return {
            latitude: meta.five_hundred_pixels.location.latitude,
            longitude: meta.five_hundred_pixels.location.longitude,
            category: meta.five_hundred_pixels.category
        };
    },

    tests: [{
        page: "http://500px.com/upcoming",
        selector: ".title a"
    },
        "http://500px.com/photo/13541787?from=upcoming"
    ]
};