const querystring = require('querystring');

module.exports = {

    mixins: [
        /**
         *  This mixin does not allow Dailymotion parameters to be transmitted
         *
         *     //"oembed-video"
         */
        "oembed-title",
        "oembed-author",
        "oembed-site",
        "oembed-thumbnail",
        "domain-icon",
        "og-description",
        "canonical",
        "video"
    ],

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

    tests: [{
        noFeeds: true
    },
        "http://www.dailymotion.com/video/x10bix2_ircam-mani-feste-2013-du-29-mai-au-30-juin-2013_creation#.Uaac62TF1XV",
        "http://www.dailymotion.com/swf/video/xcv6dv_pixels-by-patrick-jean_creation",
        "http://www.dailymotion.com/embed/video/xcv6dv_pixels-by-patrick-jean_creation",
        "https://dailymotion.com/embed/video/x5yiamz?queue-enable=false"
    ]
};