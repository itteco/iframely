module.exports = {

    re: /^https?:\/\/animoto\.com\/play\/\w+/i,

    mixins: [
        "oembed-title",
        "oembed-description",
        "oembed-author",
        "oembed-site",
        "oembed-thumbnail",
        "oembed-video",
        "domain-icon"
    ],

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