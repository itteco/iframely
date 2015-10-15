module.exports = {

    re: /https?:\/\/www\.screenr\.com\/\w+/i,

    mixins: [
        "oembed-title",
        "oembed-thumbnail",
        "oembed-author",
        "oembed-site",
        "oembed-video",
        "domain-icon"
    ],

    tests: [
        "http://www.screenr.com/e4HH"
    ]
};