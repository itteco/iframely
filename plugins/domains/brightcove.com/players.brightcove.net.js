var cheerio = require('cheerio');
var utils = require('../../../lib/utils');

module.exports = {

    re: [
        /^https?:\/\/players\.brightcove\.net\/\d+\/[a-zA-Z0-9]+_[a-zA-Z0-9]+\/index\.html\?videoId=\d+/i
        // Avoid oembed error on experiences such as https://players.brightcove.net/6057277732001/experience_5fdc1e38e57a07002222f857/share.html
        // Аuto-discovery on expeience pages is for a single video and isn't right either. So let oEmbed fail there for now.
    ],

    mixins: [
        "oembed-title",
        "oembed-site",
        "oembed-error"
    ],

    //HTML parser will 404 if BC account or player does not exist.
    getLinks: function(url, oembed, options, cb) {

        var player = {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.oembed, CONFIG.R.player, CONFIG.R.html5]
        };

        // autoplay=true comes from `brightcove-in-page-promo` only and follows whitelistRecord
        if (/&autoplay=true/.test(url)) {
            player.rel.push('autoplay');
        } else {
            player.autoplay = "autoplay=true";
        }

        var $container = cheerio('<div>');
        try {
            $container.html(oembed.html);
        } catch (ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {
            player.href = $iframe.attr('src') + (/&autoplay=true/.test(url) ? '&autoplay=true' : ''); // autoplay=true in URL comes from brightcove-allow-in-page whitelist record            
        }

        if (/&iframe-url=/.test(url)) {
            var src = url.match(/&iframe-url=([^&]+)/i);
            player.href = Buffer.from(src[1], 'base64').toString()

            delete player.type;
            player.accept = CONFIG.T.text_html; // verify that it exists and isn't X-Frame-Optioned            
        }

        if (oembed.thumbnail_url) {

            utils.getImageMetadata(oembed.thumbnail_url, options, function(error, data) {

                var links = [];

                if (error || data.error) {

                    console.log ('Error getting thumbnail sizes for Brightcove: ' + url);

                } else if (data.width && data.height) {

                    links.push({
                        href: oembed.thumbnail_url,
                        type: CONFIG.T.image, 
                        rel: CONFIG.R.thumbnail,
                        width: data.width,
                        height: data.height
                    });                    
                }

                player['aspect-ratio'] = (data.width && data.height) ? data.width / data.height : oembed.width / oembed.height;
                links.push(player);

                cb(null, links);

            });
        } else {
            cb (null, player);
        }

    },

    tests: [{skipMixins:['oembed-error']},
        "https://players.brightcove.net/5132998173001/default_default/index.html?videoId=5795255604001"
        // But sometimes thumbnail aspect is actually incorrect while oembed default is correct:
        // https://players.brightcove.net/5132998173001/default_default/index.html?videoId=5795255604001
    ]
};    