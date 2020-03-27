const querystring = require('querystring');

module.exports = {

    mixins: [
        "oembed-title",
        "oembed-author",
        "oembed-site",
        "oembed-thumbnail",
        "domain-icon",
        "og-description",
        "canonical",
        "video"
    ],

    /**
     *  Values for `get_params`: 
     *   - queue-enable=false  - https://faq.dailymotion.com/hc/en-us/articles/360000713928-Disabling-the-Up-Next-Queue
     *   - ui-start-screen-info=0 - hide title amontg other things - https://nextgenthemes.com/how-to-hide-titles-and-change-other-setting-for-youtube-vimeo-embeds-in-wordpress-with-arve/
     */
    getLink: function (url, oembed, options) {
        var playlistParams = querystring.parse(options.getProviderOptions('dailymotion.get_params', '').replace(/^\?/, ''));
        var qs = querystring.stringify(playlistParams);
        var href = oembed.getIframeAttr('src');

        if (href && oembed.height) {
            return {
                href: href + (href.indexOf("?") > -1 ? "&" : "?") + qs,
                type: CONFIG.T.text_html,
                "rel": [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.ssl, CONFIG.R.oembed],
                "aspect-ratio": oembed.width / oembed.height,
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
        noFeeds: true
    }, {
        skipMixins: ["video", "og-description"]
    },
        "http://www.dailymotion.com/video/x10bix2_ircam-mani-feste-2013-du-29-mai-au-30-juin-2013_creation#.Uaac62TF1XV",
        "http://www.dailymotion.com/swf/video/xcv6dv_pixels-by-patrick-jean_creation",
        "http://www.dailymotion.com/embed/video/xcv6dv_pixels-by-patrick-jean_creation",
        "https://dailymotion.com/embed/video/x5yiamz?queue-enable=false"
    ]
};