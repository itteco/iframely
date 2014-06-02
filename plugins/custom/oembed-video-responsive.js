var jquery = require('jquery');

module.exports = {

    getLink: function(oembed) {

        var $container = jquery('<div>');
        try{
            $container.html(oembed.html5 || oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {
            return {
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.oembed, CONFIG.R.html5],
                "aspect-ratio": oembed.width / oembed.height
            }
        }
    }
};