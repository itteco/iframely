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
            page: "http://weheartit.com/tag/white",
            selector: ".heart-button"
        },
        {
            skipMixins: ["keywords", "og-title"]
        }
    ]
};