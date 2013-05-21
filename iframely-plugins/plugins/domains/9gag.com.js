module.exports = {

    mixins: [
        "og-title",
        "og-image",
        "twitter-image"
    ],

    tests: [ {
        page: "http://9gag.com",
        selector: "h1 a.badge-section-link-target"
    },
        "http://9gag.com/gag/5500821"
    ]
};