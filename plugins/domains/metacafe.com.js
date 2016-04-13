module.exports = {

    re: [
        /^https?:\/\/www\.metacafe\.com\/watch\/(\d+)/i
    ],

    mixins: [
        "canonical",
        "favicon",
        "copyright",
        "og-site",
        "og-title",
        "og-description",
        "author"
    ],

    getLink: function(og, urlMatch) {

        return [{
            href: "http://www.metacafe.com/embed/" + urlMatch[1] + "/",
            rel: [CONFIG.R.player, CONFIG.R.autoplay],
            type: CONFIG.T.text_html,
            "aspect-ratio": 440 / 280 // There is also 
                                    // meta.video_width / meta.video_height, 
                                    // but that ratio would actually be worse than the one from embed code
        }, {
            href: ((og.image && og.image.url) || '').replace(/\/preview_240p_%07d\.mp4\.jpg$/, '\/preview.jpg'),
            rel: CONFIG.R.thumbnail,
            type: CONFIG.R.image
        }]
    },

    tests: [{
        page: "http://www.metacafe.com",
        selector: ".ItemTitle a"
    },
        "http://www.metacafe.com/watch/9677285/django_unchained_movie_review"
    ]
};