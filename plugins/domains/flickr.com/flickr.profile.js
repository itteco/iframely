module.exports = {

    re: /^https?:\/\/www\.flickr\.com\/photos\/([@a-zA-Z0-9_\.-]+)\/?([?#].*)?$/,

    mixins: [
        "*"
    ],

    getLink: function(urlMatch, og) {
        if (og.image) {
            var m = og.image.url.match(/\/(\d+)_\w+_\w\.jpg$/i);
            return {
                href: 'https://www.flickr.com/photos/' + urlMatch[1] + '/' + m[1] + '/player',
                rel: [CONFIG.R.promo, CONFIG.R.player, CONFIG.R.slideshow, CONFIG.R.html5],
                type: CONFIG.T.text_html,
                "aspect-ratio": 4/3
            };
        }
    },

    tests: [{
        noFeeds: true
    },
        "https://www.flickr.com/photos/astridyskout/",
        "https://www.flickr.com/photos/sciandra"
    ]
};