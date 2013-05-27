module.exports = {

    mixins: [
        "og-title",
        "oembed-author",
        "oembed-site",
        "description",
        "oembed-thumbnail",
        "favicon",
        "canonical"
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

    getLink: function(meta) {

        if (!meta.twitter || !meta.twitter.image)
            return;

        return {
            href: meta.twitter.image.url,
            type: CONFIG.T.image,
            rel: [CONFIG.R.image, CONFIG.R.twitter, CONFIG.R.iframely],
            width: meta.twitter.image.width,
            height: meta.twitter.image.height
        };
    },    

    tests: [{
        page: "http://500px.com/upcoming",
        selector: ".title a"
    },
        "http://500px.com/photo/13541787?from=upcoming"
    ]
};