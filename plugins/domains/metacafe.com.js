module.exports = {

    re: [
        /^https?:\/\/www\.metacafe\.com\/watch\/(\d+)/i
    ],

    mixins: [
        "*"
    ],

    getLink: function(og, urlMatch) {

        if (og.type === 'video') {

            return [{
                href: "http://www.metacafe.com/embed/" + urlMatch[1] + "/",
                rel: [CONFIG.R.player, CONFIG.R.autoplay, CONFIG.R.html5],
                accept: CONFIG.T.text_html,
                "aspect-ratio": 440 / 280 // There is also 
                                        // meta.video_width / meta.video_height, 
                                        // but that ratio would actually be worse than the one from embed code
            }, {
                href: ((og.image && og.image.url) || '').replace(/\/preview_240p_%07d\.mp4\.jpg$/, '\/preview.jpg'),
                rel: CONFIG.R.thumbnail,
                type: CONFIG.R.image
            }]
        }
    },

    tests: [
        "http://www.metacafe.com/watch/9677285/django_unchained_movie_review"
        // n/a http://www.metacafe.com/watch/10777115/prince_little_red_corvette/
    ]
};