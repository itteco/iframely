const cheerio = require('cheerio');
const utils = require('../../lib/utils');

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

                    if (options.getProviderOptions(CONFIG.O.less, false)) {                        
                        widget.href += !/&?hide_cover=1/i.test(widget.href) ? '&hide_cover=1' : (/&?mini=1/i.test(widget.href) ? '' : '&mini=1');
                    } else if (options.getProviderOptions(CONFIG.O.more, false)) {
                        if (!/&?mini=1/i.test(widget.href)) {
                            widget.href = widget.href.replace(/&?hide_cover=1/i, ''); // will skip if it's biggest player already
                        } else {
                            widget.href = widget.href.replace(/&?mini=1/i, ''); // will up the player from mini do default
                        }
                    }

                    // mixcloud ignores &mini=1 if there's no &hide_cover=1.
                    widget.height = !/&?hide_cover=1/i.test(widget.href) ? 400 : (/&?mini=1/i.test(widget.href) ? 60 : 120);
                    widget.scrolling = "no";
                    widget.rel.push(CONFIG.R.player);
                    widget.rel.push(CONFIG.R.auido);

                    widget.options = utils.getVary(options,
                        widget.height === 400, //isMax
                        widget.height === 60, //isMin
                        { // Min/max messages, null if not supported for particular URL
                            min: "Mini widget",
                            max: "Picture widget",
                            default: "Classic widget"
                        }
                    );

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