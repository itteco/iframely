module.exports = {

    mixins: [
        "oembed-title",
        "oembed-description",
        "oembed-author",
        "oembed-site",
        "oembed-thumbnail",
        "oembed-video-responsive"
    ],

    getLink: function() {
        return {
            href: '//d1v3v5jtx1iozq.cloudfront.net/images/icons/touchicon-144-a95f2d0d.png',
            type: CONFIG.T.image,
            rel: CONFIG.R.icon
        }
    },

    tests: [
        "http://animoto.com/play/k01h0yvqf59whdd80nla1q",
        {
            skipMixins: [
                "oembed-thumbnail",
                "oembed-author"
            ]
        }
    ]
};