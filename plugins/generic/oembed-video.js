var jquery = require('jquery');

module.exports = {

    getLink: function(oembed) {
        if (oembed.type != "video") {
            return;
        }

        var $container = jquery('<div>');
        try{
            $container.html(oembed.html5 || oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {
            return {
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.oembed],
                width: oembed.width,
                height: oembed.height
            }
        }
    },

    getData: function(oembed) {

        if (oembed.type != "video") {
            return;
        }

        return {
            embed_html: oembed.html,
            // TODO: tie rel from data to nested link.
            rel: [CONFIG.R.player, CONFIG.R.oembed],
            width: oembed.width,
            height: oembed.height
        };
    }
};