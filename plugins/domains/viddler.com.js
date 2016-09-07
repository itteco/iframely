module.exports = {

    re: [
        /^https?:\/\/www\.viddler\.com\/v\/([a-z0-9\-]+)/i
    ],

    mixins: [
        "oembed-title",
        "oembed-author",
        "oembed-site",
        "oembed-thumbnail",
        "oembed-video",
        "domain-icon"
    ],

    tests: [
        "http://www.viddler.com/v/3027cd1f"
    ]
};