var jquery = require('jquery');

module.exports = {

    getLinks: function(meta, oembed) {

        if (oembed.type != "rich") {
            return;
        }

        var $container = jquery('<div>');

        try{
            $container.html(oembed.html5 || oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        var rel = [CONFIG.R.oembed];
        if (meta.og && (meta.og.type in {"video": 1, "audio": 1} || meta.og.video || meta.og.audio)) {
            rel.push(CONFIG.R.player);
        }

        if ($iframe.length == 1) {

            return {
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: rel,
                width: oembed.width,
                height: oembed.height
            };

        } else {

            return {
                type: 'text/html',
                template: "embed-html",
                template_context: {
                    title: oembed.title,
                    html: oembed.html
                },
                rel: rel,
                width: oembed.width,
                height: oembed.height
            };
        }
    }
};