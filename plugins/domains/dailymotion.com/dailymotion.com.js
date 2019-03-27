module.exports = {

    mixins: [

        // These mixins are disabled as otherwise the age-restricted vids don't work (htmlparser follows re-direct to another URL)
        //"canonical",
        //"video",

        "oembed-title",
        "oembed-author",
        "oembed-site",
        "oembed-thumbnail",
        "oembed-video"
    ],

    getLink: function (url, oembed, cb) {
        cb(null, {
            href: "http://static1.dmcdn.net/images/apple-touch-icon.png.vcbf86c6fe83fbbe11",
            type: CONFIG.T.image_icon,
            rel: CONFIG.R.icon
        });
    },

    tests: [{
        noFeeds: true
    },
        "http://www.dailymotion.com/video/x10bix2_ircam-mani-feste-2013-du-29-mai-au-30-juin-2013_creation#.Uaac62TF1XV",
        "http://www.dailymotion.com/swf/video/xcv6dv_pixels-by-patrick-jean_creation",
        "http://www.dailymotion.com/embed/video/xcv6dv_pixels-by-patrick-jean_creation"
    ]
};