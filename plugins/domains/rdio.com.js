var jquery = require('jquery');

module.exports = {

    mixins: [
        "oembed-title",
        "oembed-site"
    ],

    getLink: function(oembed) {

        var $container = jquery('<div>');
        try {
            $container.html(oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');
        var player; 

        if ($iframe.length == 1) {
            player = {
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: CONFIG.R.player,
                "min-width": oembed.width,
                "min-height": oembed.height
            }
        }

        return [player, {
            }, {
                href: oembed.thumbnail_url,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail,
                width: oembed.thumbnail_width,
                height: oembed.thumbnail_height
            }, {
                href: '//www.rdio.com/favicon.ico',
                type: CONFIG.T.image,
                rel: CONFIG.R.icon,
        }]
    },

    tests: [
        "http://www.rdio.com/artist/Big_Boi/album/Vicious_Lies_and_Dangerous_Rumors_(Deluxe_Explicit_Version)/track/CPU/"
    ]
};