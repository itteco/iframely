var _ = require('underscore');

module.exports = {

    re: [
        /http:\/\/\w+\.ign\.com\/\w+\/videos\/\d+\/\w+\/[a-z0-9-]+/i,
        /http:\/\/www\.ign\.com\/videos\/\d+\/\d+\/\d+\/[a-z0-9-]+/i
    ],


    mixins: [
        "favicon",
        "canonical",
        "date",
        "og-image",
        "og-article",
        "og-description",
        "og-site",
        "og-title",
        "media-detector"
    ],

    getLink: function(meta) {

        var url = _.find(meta.alternate, function(url) {
            return url.match && url.match(/http:\/\/www\.ign\.com\/videos/)
        });

        if (url) {
            return {
                href: 'http://widgets.ign.com/video/embed/content.html?url=' + url,
                type: CONFIG.T.text_html,
                rel: CONFIG.R.player,
                "aspect-ratio": 468 / 263
            };
        }
    },

    tests: [{
        feed: 'http://me.ign.com/en/feed.xml',
        getUrl: function(url) {
            return url.match(/videos/) && url;
        }
    },
        "http://me.ign.com/en/videos/112217/video/our-favorite-games-of-new-york-comic-con",
        "http://me.ign.com/en/videos/111115/fix/ps4-firmware-30-new-battlefront-details-ign-daily"
    ]
};