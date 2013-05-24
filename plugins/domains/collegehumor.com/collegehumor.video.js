module.exports = {

    re: /http:\/\/www\.collegehumor\.com\/video\.*/,

    // TODO: add predefined size for og-image: 640x360.

    mixins: [
        "og-title",
        "description",
        "og-image",
        "og-video-responsive"
    ],

    tests: [{
        pageWithFeed: "http://www.collegehumor.com/videos"
    },
        "http://www.collegehumor.com/video/6853117/look-at-this-instagram-nickelback-parody"
    ]
};