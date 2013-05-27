var jquery = require('jquery');

module.exports = {

    // TODO: check thumbnail.

    mixins: [
        "oembed-title",
        "oembed-author",
        "oembed-site",
        "geo-url"
    ],

    getLink: function(oembed) {

        var $container = jquery('<div />');
        $container.html(oembed.html);
        var $embed = $container.find('embed');

        return [{
            href: $embed.attr('src') + '&' + $embed.attr("FlashVars"),
            type: CONFIG.T.flash,
            rel: [CONFIG.R.player, CONFIG.R.iframely],
            "aspect-ratio": oembed.width / oembed.height
        }, {
            href: 'http://qik.com/favicon.ico',
            type: CONFIG.T.image,
            rel: [CONFIG.R.icon, CONFIG.R.iframely]
        }]
    },

    tests: [{
        page: "http://qik.com/video/search?order=recent&query=music",
        selector: "h6 a"
    },
        "http://qik.com/video/52767028"
    ]
};