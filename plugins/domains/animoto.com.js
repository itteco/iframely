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

    tests: [{
        noFeeds: true
    }]
};