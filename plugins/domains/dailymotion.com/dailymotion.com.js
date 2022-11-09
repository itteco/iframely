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

    /**
     *  Values for `get_params`: 
     *   - queue-enable=false  - https://faq.dailymotion.com/hc/en-us/articles/360000713928-Disabling-the-Up-Next-Queue
     *   - ui-start-screen-info=0 - hide title amontg other things - https://nextgenthemes.com/how-to-hide-titles-and-change-other-setting-for-youtube-vimeo-embeds-in-wordpress-with-arve/
     */
    getLink: function (url, iframe, options) {
        var playlistParams = querystring.parse(options.getProviderOptions('dailymotion.get_params', '').replace(/^\?/, ''));

        if (iframe.src && iframe.height) {
            return {
                href: iframe.replaceQuerystring(playlistParams),
                type: CONFIG.T.text_html,
                "rel": [CONFIG.R.player, CONFIG.R.oembed],
                "aspect-ratio": iframe.width / iframe.height,
                scrolling: 'no',
                autoplay: "autoplay=1"
            };
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
        "http://www.dailymotion.com/video/x10bix2_ircam-mani-feste-2013-du-29-mai-au-30-juin-2013_creation#.Uaac62TF1XV",
        "http://www.dailymotion.com/swf/video/xcv6dv_pixels-by-patrick-jean_creation",
        "http://www.dailymotion.com/embed/video/xcv6dv_pixels-by-patrick-jean_creation",
        "https://dailymotion.com/embed/video/x5yiamz?queue-enable=false"
    ]
};