var jquery = require('jquery');

module.exports = {

    getLink: function(oembed) {

        var richReader = oembed.type === "rich" && whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.rich', "reader");
        var video = oembed.type === "video";

        if (!video && !richReader) {
            return;
        }

        var $container = jquery('<div>');
        try{
            $container.html(oembed.html5 || oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {

            var rel = [CONFIG.R.oembed];

            if (richReader) {
                // Iframed reader.
                rel.push(CONFIG.R.reader);
            } else {
                // Iframed player.
                rel.push(CONFIG.R.player);
            }

            return {
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: rel,
                width: oembed.width,
                height: oembed.height
            };

        } else if (richReader) {

            return {
                html: oembed.html || oembed.html5,
                type: CONFIG.T.safe_html,
                rel: [CONFIG.R.reader, CONFIG.R.inline]
            };
        }
    }/*,

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
    */
};