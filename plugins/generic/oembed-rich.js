var jquery = require('jquery');

module.exports = {

    getLink: function(meta, oembed) {

        if (oembed.type != "rich") {
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
                rel: [CONFIG.R.oembed, CONFIG.R.player],
                width: oembed.width,
                height: oembed.height
            }
        }
    },

    getData: function(meta, oembed) {

        if (oembed.type != "rich") {
            return;
        }

        var rel = [CONFIG.R.oembed];
        if (meta.og && (meta.og.type in {"video": 1, "audio": 1} || meta.og.video || meta.og.audio)) {
            rel.push(CONFIG.R.player);
        }

        return {
            embed_html: oembed.html,
            // TODO: tie rel from data to nested link.
            rel: rel,
            width: oembed.width,
            height: oembed.height
        };
    }
};