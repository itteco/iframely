module.exports = {

    mixins: [
        "og-title",
        "twitter-image",
        "image_src",
        "og-video"
    ],

    tests: [{
        page: "http://www.hulu.com/browse/picks/trending-now",
        selector: ".thumbnail a"
    },
        "http://www.hulu.com/watch/395910"
    ]
};