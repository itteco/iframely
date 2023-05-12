export default {

    re: [
        /^https?:\/\/players\.brightcove\.net\/\d+\/[a-zA-Z0-9]+_[a-zA-Z0-9]+\/index\.html\?videoId=\d+/i,
        // Avoid oembed error on experiences such as https://players.brightcove.net/6057277732001/experience_5fdc1e38e57a07002222f857/share.html
        // Аuto-discovery on expeience pages is for a single video and isn't right either. So let oEmbed fail there for now.

        /^https?:\/\/players\.brightcove\.net\/pages\/v\d\/index\.html\?/i
    ],

    mixins: [
        "oembed-title",
        "oembed-site",
        "oembed-error",
        "oembed-iframe"
    ],

    getMeta: function() {
        return {
            provider_url: 'brightcove.com' // for consents
        }
    },

    //HTML parser will 404 if BC account or player does not exist.
    getLinks: function(url, iframe, utils, options, cb) {

        var player = {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.oembed]
        };

        // autoplay=true comes from `brightcove-in-page-promo` only and follows whitelistRecord
        if (/&autoplay=true/.test(url)) {
            player.rel.push('autoplay');
        } else {
            player.autoplay = "autoplay=true";
        }

        if (iframe.src) {
            player.href = iframe.src + (/&autoplay=true/.test(url) ? '&autoplay=true' : ''); // autoplay=true in URL comes from brightcove-allow-in-page whitelist record            
        }

        if (/&iframe-url=/.test(url)) {
            var src = url.match(/&iframe-url=([^&]+)/i);
            player.href = Buffer.from(src[1], 'base64').toString()

            delete player.type;
            player.accept = CONFIG.T.text_html; // verify that it exists and isn't X-Frame-Optioned            
        }

        if (iframe.placeholder) {

            utils.getImageMetadata(iframe.placeholder, options, function(error, data) {

                var links = [];

                if (error || data.error) {

                    console.log ('Error getting thumbnail sizes for Brightcove: ' + url);

                } else if (data.width && data.height) {

                    links.push({
                        href: iframe.placeholder,
                        type: CONFIG.T.image, 
                        rel: CONFIG.R.thumbnail,
                        width: data.width,
                        height: data.height
                    });                    
                }

                player['aspect-ratio'] = (data.width && data.height) ? data.width / data.height : iframe.width / iframe.height;
                links.push(player);

                return cb(null, links);

            });
        } else {
            return cb (null, player);
        }

    },

    tests: [{skipMixins:['oembed-error']},
        "http://players.brightcove.net/pages/v1/index.html?accountId=5660549837001&playerId=default&videoId=6303785895001&mode=iframe"
        // But sometimes thumbnail aspect is actually incorrect while oembed default is correct:
        // https://players.brightcove.net/5132998173001/default_default/index.html?videoId=5795255604001
    ]
};    