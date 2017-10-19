const cheerio = require('cheerio');

module.exports = {

    mixins: [
        "oembed-title",
        "oembed-description",
        "oembed-author",
        "oembed-site",
        //"oembed-rich",
        "domain-icon"
    ],

    getLink: function (oembed, whitelistRecord, options) {

        // let Whitelist/default fallbacks take control if oEmbed fails
        if (!(oembed.type === "rich" && whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.rich'))) {
            return;
        } else {

            var widget = {
                rel: [CONFIG.R.oembed, CONFIG.R.html5],
                type: CONFIG.T.text_html
            };

            var $container = cheerio('<div>');
            try {
                $container.html(oembed.html);
            } catch (ex) {}

            var $iframe = $container.find('iframe');

            if ($iframe.length == 1) {

                widget.href = $iframe.attr('src');
                widget.autoplay = 'autoplay=1';

                if (/\/widget\/follow\//.test(widget.href)) {
                    widget.rel.push(CONFIG.R.summary);
                    widget.width = oembed.width;
                    widget.height = oembed.height;

                } else {
                    if (options.getProviderOptions(CONFIG.O.full, false)) {

                        widget.href = widget.href.replace(/&?hide_cover=1/, ''); // will skip if it's biggest player already
                        widget.href = widget.href.replace(/&?mini=1/, ''); // will skip if it's not the smallers player

                    } else if (options.getProviderOptions(CONFIG.O.compact, false)) {
                        widget.href += widget.href.indexOf('hide_cover') == -1 ? '&hide_cover=1' : '&mini=1';
                    }

                    widget.height = widget.href.indexOf('mini=1') > -1 ? 60 : (widget.href.indexOf('hide_cover=1') > -1 ? 120 : 400);
                    widget.scrolling = "no";
                    widget.rel.push(CONFIG.R.player);
                }                

                return [widget, {
                    href: oembed.image, 
                    type: CONFIG.T.image, 
                    rel: CONFIG.R.thumbnail
                }]
            }
        }

    },

    tests: [{noFeeds: true}, {skipMixins: ["oembed-description"]},
        "https://www.mixcloud.com/djtraviesa/"
    ]
};