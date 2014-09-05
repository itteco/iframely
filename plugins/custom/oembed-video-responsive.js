var jquery = require('jquery');

module.exports = {

    getLink: function(oembed, whitelistRecord) {

        var $container = jquery('<div>');
        try{
            $container.html(oembed.html5 || oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {

            var href = $iframe.attr('src');

            if (whitelistRecord && (whitelistRecord.isAllowed('oembed.video', 'ssl') || whitelistRecord.isAllowed('oembed.rich', 'ssl'))) {
                href = href.replace(/^https?:\/\//i, '//');
            }

            return {
                href: href,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.oembed, CONFIG.R.html5],
                "aspect-ratio": oembed.width / oembed.height
            };
        }
    }
};