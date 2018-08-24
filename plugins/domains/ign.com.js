var _ = require('underscore');

module.exports = {

    re: [
        /^https?:\/\/\w+\.ign\.com\/\w+\/videos\/\d+\/\w+\/[a-z0-9-]+/i,
        /^https?:\/\/\w+\.ign\.com\/videos\/\d+\/\d+\/\d+\/[a-z0-9-]+/i
    ],


    mixins: ["*"],

    getLink: function(meta) {

        var url = _.find(meta.alternate, function(url) {
            return url.match && url.match(/https?:\/\/www\.ign\.com\/videos/i)
        });

        if (url) {
            return {
                href: '//widgets.ign.com/video/embed/content.html?url=' + url,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                autoplay: 'autoplay=1',
                "aspect-ratio": 468 / 263
            };
        }
    },

    tests: [{
        feed: 'https://me.ign.com/en/feed.xml',
        getUrl: function(url) {
            return url.match(/videos?/i) && url;
        }
    },
        "https://me.ign.com/en/videos/112217/video/our-favorite-games-of-new-york-comic-con",
        "https://me.ign.com/en/videos/111115/fix/ps4-firmware-30-new-battlefront-details-ign-daily"
    ]
};