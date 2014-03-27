var _ = require('underscore');

module.exports = {

    re: /^https?:\/\/www\.facebook\.com\/photo\.php/i,

    highestPriority: true,

    mixins: [
        "favicon"
    ],

    getLink: function(cheerio) {

        var $image = cheerio('img#fbPhotoImage');

        if ($image.attr('width') == 1) {
            return;
        }

        var preview = $image.attr('src');

        if (preview) {
            return {
                href: preview,
                type: CONFIG.R.image,
                rel: CONFIG.R.image
            };
        }
    },

    tests: [
        "http://www.facebook.com/photo.php?fbid=4253313542476&set=a.4253312782457.2159583.1574932468&type=1",
        {
            noFeeds: true
        }
    ]
};