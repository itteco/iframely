module.exports = {

    mixins: [
        "canonical",
        "og-site",
        "og-title",
        "og-description",

        "favicon",
        "twitter-video",
        "og-image"
    ],

    tests: [{
        page: "http://www.nhl.com/index.html",
        selector: ".group div a"
    },
        "http://video.nhl.com/videocenter/console?catid=35&id=260674"
    ]
};