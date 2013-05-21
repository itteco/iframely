module.exports = {

    mixins: [
        "og-title",
        "og-image",
        "video_src-responsive"
    ],

    tests: [{
        page: "http://dipdive.com/",
        selector: ".win_content:first h3 a"
    },
        "http://dippoetry.dipdive.com/media/151409"
    ]
};