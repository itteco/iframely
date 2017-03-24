var $ = require('cheerio');

module.exports = {

    mixins: [
        "oembed-title",
        "oembed-site",
        "oembed-author",
        "oembed-description",
        // do not link to meta as it disables support for direct player urls redirects from w.soundcloud.com
        "domain-icon"
    ],

    getLink: function(oembed, options) {

        var $container = $('<div>');
        try {
            $container.html(oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');
        var player, thumbnail, autoplay;

        if ($iframe.length == 1) {

            var old_player = options.getProviderOptions('soundcloud.old_player', false);

            var href = $iframe.attr('src');
            if (old_player) {
                href = href.replace('visual=true', 'visual=false');
            }

            player = {
                href: href,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                height: old_player ? 114 : oembed.height,
                "min-width": oembed.width
            };

            autoplay = {
                href: href + '&auto_play=true',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.autoplay],
                height: old_player ? 114 : oembed.height,
                "min-width": oembed.width
            };            
        }

        if (oembed.thumbnail_url) {
            thumbnail = {
                href: oembed.thumbnail_url.replace('http:',''),
                type: CONFIG.T.image,
                rel: [CONFIG.R.thumbnail, CONFIG.R.oembed],
                width: oembed.thumbnail_width,
                height: oembed.thumbnail_height
            }
        }

        return [
            player, thumbnail, autoplay
        ];
    },

    tests: [
        "https://soundcloud.com/posij/sets/posij-28-hz-ep-division",
        {
            skipMixins: [
                "oembed-description"
            ]
        }
    ]
};
