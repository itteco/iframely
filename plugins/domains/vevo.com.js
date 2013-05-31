module.exports = {

    mixins: [
        "canonical",
        "og-title",
        "video-duration",
        "og-image",
        "site",
        "keywords",
        "twitter-player",
        "favicon"
    ],

    tests: [ {
        page: "http://www.vevo.com/videos/topvideos",
        selector: ".videoItemImage"
    },
        "http://www.vevo.com/watch/royksopp/the-girl-and-the-robot/FRA110900110"
    ]
};