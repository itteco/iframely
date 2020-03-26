const querystring = require('querystring');

module.exports = {

    mixins: [
        /**
         * These mixins are disabled as otherwise the age-restricted vids don't work
         * (htmlparser follows re-direct to another URL)
         *
         *     //"canonical",
         *     //"video",
         *
         *  This mixin does not allow Dailymotion parameters to be transmitted
         *
         *     //"oembed-video"
         */
        "oembed-title",
        "oembed-author",
        "oembed-site",
        "oembed-thumbnail",

    ],

    getLink: function (url, oembed, options, cb) {

        var playlistParams = querystring.parse(options.getProviderOptions('dailymotion.get_params', '').replace(/^\?/, ''));
        var qs = querystring.stringify(playlistParams);
        if (qs !== '') {qs = '?' + qs}

        var href = oembed.getIframeAttr('src');
        var links = [{
            href: "http://static1.dmcdn.net/images/apple-touch-icon.png.vcbf86c6fe83fbbe11",
            type: CONFIG.T.image_icon,
            rel: CONFIG.R.icon
        }, {
            href: href + qs,
            type: CONFIG.T.text_html,
            "rel": [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.ssl, CONFIG.R.oembed],
            "aspect-ratio": oembed.width / oembed.height,
            scrolling: 'no',
            autoplay: "autoplay=1"
        }];
        cb(null, links);
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