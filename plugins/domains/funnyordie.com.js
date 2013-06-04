var jquery = require('jquery');

module.exports = {

    mixins: [
        "canonical",
        "oembed-title",
        "oembed-author",
        "oembed-site",
        "oembed-duration",

        "og-image",
        "favicon"
    ],

    getLink: function(oembed) {

        var $container = jquery('<div>');
        try {
            $container.html(oembed.html);
        } catch(ex) {}

        var $junk_div = $container.remove('div');
        var $iframe = $container.find('iframe');

        return {
            href: $iframe.attr('src'),
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.oembed],
            "aspect-ratio": oembed.width / oembed.height
        }
    },   

    tests: [{
        pageWithFeed: "http://www.funnyordie.com/"
    }]
};