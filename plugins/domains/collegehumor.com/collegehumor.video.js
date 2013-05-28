var jquery = require('jquery');

module.exports = {

    re: /http:\/\/www\.collegehumor\.com\/video\.*/,

    // TODO: add predefined size for og-image: 640x360.

    mixins: [
        "oembed-title",
        "oembed-author",
        "oembed-site",
        "oembed-thumbnail"
    ],

    getLink: function(oembed) {

        var $container = jquery('<div>');
        try{
            $container.html(oembed.html);
        } catch(ex) {}

        var src = $container.find('object').attr('data');

        if (src) {
            return {
                href: src,
                type: CONFIG.T.flash,
                rel: CONFIG.R.player,
                "aspect-ratio": oembed.width / oembed.height
            };
        }
    },

    tests: [{
        pageWithFeed: "http://www.collegehumor.com/videos"
    },
        "http://www.collegehumor.com/video/6853117/look-at-this-instagram-nickelback-parody"
    ]
};