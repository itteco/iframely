module.exports = {

    mixins: [
        "*",
        "og-image-rel-image"
    ],

    tests: [
        "http://weheartit.com/entry/79346677/explore?context_user=jaassnna",
        {
            page: "http://weheartit.com/tag/white",
            selector: ".heart-button"
        },
        {
            skipMixins: ["keywords", "og-title"]
        }
    ]
};