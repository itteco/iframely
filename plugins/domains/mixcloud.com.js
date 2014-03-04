module.exports = {

    mixins: [
        "oembed-title",
        "og-description",
        "oembed-site",
        "oembed-author",

        "oembed-video-responsive",
        "og-image",
        "favicon"
    ],

    tests: [{
        page: "http://www.mixcloud.com/categories/comedy/",
        selector: "h3.card-cloudcast-title a"
    }, "http://www.mixcloud.com/adamkvasnica3/my-cup-of-tea"]
};