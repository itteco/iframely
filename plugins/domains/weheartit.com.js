module.exports = {

    mixins: [
        "og-title",
        "og-description",
        "keywords",
        "og-site",
        "canonical",
        "author",

        "og-image-rel-image",
        "favicon"
    ],

    tests: [
        "http://weheartit.com/entry/79346677/explore?context_user=jaassnna",
        {
            pageWithFeed: "http://weheartit.com"
        },
        {
            skipMixins: ["keywords"]
        }
    ]
};