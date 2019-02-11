const $ = require('cheerio');
const utils = require('../../../lib/utils');

module.exports = {

    provides: '__allow_soundcloud_meta',

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
        var links = [];

        if ($iframe.length == 1) {

            var old_player = options.getProviderOptions(CONFIG.O.less, false) || options.getProviderOptions('players.horizontal', false) || options.getProviderOptions('soundcloud.old_player', false);

            var href = $iframe.attr('src');
            if (old_player) {
                href = href.replace('visual=true', 'visual=false');
            } else if (options.getProviderOptions(CONFIG.O.more, false)) {
                href = href.replace('visual=false', 'visual=true');
            }

            var player = {
                href: href,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.audio, CONFIG.R.html5],
                autoplay: "auto_play=true",
                height: /visual=false/.test(href) ? 114 : oembed.height,
                "min-width": oembed.width
            };

            player.options = utils.getVary(options,
                /visual=true/.test(href), //isMax
                /visual=false/.test(href), //isMin
                { // Min/max messages, null if not supported for particular URL
                    min: "Classic embed",
                    max: "Visual embed"
                }
            );

            links.push(player);
        }

        if (oembed.thumbnail_url && !/\/images\/fb_placeholder\.png/.test(oembed.thumbnail_url)) {
            links.push({
                href: oembed.thumbnail_url.replace('http:',''),
                type: CONFIG.T.image,
                rel: [CONFIG.R.thumbnail, CONFIG.R.oembed],
                width: oembed.thumbnail_width,
                height: oembed.thumbnail_height
            });
        }

        return links;
    },

    getData: function (url, oembed) {

        if (!/w\.soundcloud\.com/i.test(url) && (!oembed.thumbnail_url || /\/images\/fb_placeholder\.png/.test(oembed.thumbnail_url))) {
            return {
                __allow_soundcloud_meta: true
            }
        }
    },

    tests: [{skipMethods: ["getData"]},
        "https://soundcloud.com/posij/sets/posij-28-hz-ep-division",
        {
            skipMixins: [
                "oembed-description"
            ]
        }
    ]
};
