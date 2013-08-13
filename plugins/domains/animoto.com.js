var jquery = require('jquery');

module.exports = {

    mixins: [
        "oembed-title",
        "oembed-description",
        "oembed-author",
        "oembed-thumbnail",
        "oembed-video-responsive"
    ],

    getLink: function() {
        return {
            href: '//d14f1fnryngsxt.cloudfront.net/images/icons/favicon_a015c4373ba7b3d975ea9a8648929200.ico',
            type: CONFIG.T.image,
            rel: CONFIG.R.icon
        }
    },

    tests: [
        "http://animoto.com/play/k01h0yvqf59whdd80nla1q",
        {
            skipMixins: [
                "oembed-thumbnail"
            ]
        }
    ]
};