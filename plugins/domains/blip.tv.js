module.exports = {

    mixins: [
        "og-title",
        "oembed-thumbnail",
        "oembed-video-responsive",
        "twitter-image"
    ],

    tests: [{
        page: "http://blip.tv/",
        selector: ".EpisodeCardLink"
    },
        "http://blip.tv/LTAH/origins-of-the-original-six-montreal-6344702"
    ]
};