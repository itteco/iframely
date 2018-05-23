module.exports = {

    re: /^https?:\/\/500px\.com\/photo.+/,

    mixins: [
        "*",
        "og-image-rel-image"
    ],

    getMeta: function(meta) {

        var keywords = meta.five_hundred_pixels.tags;
        if (keywords instanceof Array) {
            keywords = meta.five_hundred_pixels.tags.join(', ');
        }

        return {
            latitude: meta.five_hundred_pixels.location && meta.five_hundred_pixels.location.latitude,
            longitude: meta.five_hundred_pixels.location && meta.five_hundred_pixels.location.longitude,
            category: meta.five_hundred_pixels.category,
            date: meta.five_hundred_pixels.uploaded,
            keywords: keywords
        };
    },

    getLinks: function(url, oembed) {
        if (oembed.type === 'photo') {
            return {
                template_context: {
                    title: oembed.title + ' | ' + oembed.provider_name,
                    img_src: oembed.url,
                    canonical: url
                },
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.image, CONFIG.R.html5, CONFIG.R.ssl, CONFIG.R.inline],
                "aspect-ratio": oembed.width / oembed.height

            }
        }
    },

    tests: [{
        feed: "https://500px.com/upcoming.rss"
    },
        "http://500px.com/photo/13541787?from=upcoming",
        "https://500px.com/photo/56891080/frozen-by-ryan-pendleton?ctx_page=1&from=user&user_id=116369"
    ]
};