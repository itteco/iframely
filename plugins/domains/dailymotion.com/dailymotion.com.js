import * as querystring from 'querystring';
import request from 'request';

export default {

    mixins: [
        "oembed-title",
        "oembed-author",
        "oembed-site",
        "oembed-thumbnail",
        "domain-icon",
        "og-description",
        "canonical",
        "oembed-iframe",
        "video"
    ],

    getLink: function (url, iframe, options) {
        var playlistParams = querystring.parse(options.getProviderOptions('dailymotion.get_params', '').replace(/^\?/, ''));

        if (iframe.src && iframe.height) {
            var player = {
                href: iframe.replaceQuerystring(playlistParams),
                type: CONFIG.T.text_html,
                "rel": [CONFIG.R.player, CONFIG.R.oembed],
                "aspect-ratio": iframe.width / iframe.height,
                scrolling: 'no',
                autoplay: "autoplay=1"
            };

            // Do not replace direct link to custom players
            if (options.redirectsHistory
                && /^https?:\/\/(?:geo\.)?dailymotion\.com\/player\/[a-zA-Z0-9]+\.html\?video=([a-zA-Z0-9]+)/i.test(options.redirectsHistory[0])) {
                player.href = options.redirectsHistory[0];
                delete player.autoplay;
            }

            return player;
        }
    },

    /**
     * Age-restrictred videos have a redirect to age confirmation page. 
     * To make it work, retrieved oembed first, 
     * then disable core restart of processing when there's a HTTP redirect.
     * Disable age-restricted, if `no_nsfw` is configured.
     */
    getData: function (oembed, options) {
        if (!options.getProviderOptions('no_nsfw', false)) {
            options.followHTTPRedirect = true;
        }
    },

    tests: [{
        getUrls: function(cb) {
            request({
                url: 'https://api.dailymotion.com/videos',
                json: true
            }, function(error, body, data) {
                if (error) {
                    return cb(error);
                }
                if (!data || !data.list) {
                    return cb('No videos list in API data');
                }
                cb(null, data.list.slice(0, 10).map(function(item) {
                    return 'https://www.dailymotion.com/video/' + item.id;
                }));
            });
            
        }
    }, {
        skipMixins: ["video", "og-description", "canonical"],
        skipMethods: ["getData"]
    },
        "https://www.dailymotion.com/video/x10bix2_ircam-mani-feste-2013-du-29-mai-au-30-juin-2013_creation#.Uaac62TF1XV",
        "https://www.dailymotion.com/swf/video/xcv6dv_pixels-by-patrick-jean_creation",
        "https://www.dailymotion.com/embed/video/xcv6dv_pixels-by-patrick-jean_creation",
        "https://dailymotion.com/embed/video/x5yiamz?queue-enable=false"
    ]
};