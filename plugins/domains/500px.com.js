module.exports = {

    mixins: [
        "og-title",
        "og-image",
        "twitter-image"
    ],

    tests: [{
        page: "http://500px.com/upcoming",
        selector: ".title a"
    },
        "http://500px.com/photo/13541787?from=upcoming"
    ]
};