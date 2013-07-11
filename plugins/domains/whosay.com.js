module.exports = {

    re: /http:\/\/www\.whosay\.com\/\w+\/photos\/\d+/i,

    mixins: [
        "canonical",
        "twitter-title",
        "twitter-description",
        "twitter-author",
        "keywords",

        "favicon",
        "og-image",
        "twitter-image-rel-image"
    ],

    tests: [{
        page: "http://www.whosay.com/shakira/photos",
        selector: "a:has(img)"
    },
        "http://www.whosay.com/shakira/photos/178983"
    ]
};