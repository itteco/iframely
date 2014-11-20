module.exports = {

    mixins: [
        "oembed-title",
        "description",
        "oembed-author",
        "oembed-thumbnail",
        "oembed-video-responsive",
        "video",
        "favicon",
        "keywords"
    ],

    tests: [{
        page: "http://blip.tv/",
        selector: ".EpisodeCardLink"
    },
        "http://blip.tv/LTAH/origins-of-the-original-six-montreal-6344702"
    ]
};