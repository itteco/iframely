module.exports = {

    mixins: [
        "og-title",
        "description",
        "oembed-author",
        "oembed-thumbnail",
        "oembed-video-responsive",
        "twitter-image"
    ],

    getMeta: function(meta) {
        return {
            keywords: meta.keywords.join(', ')
        };
    },

    tests: [{
        page: "http://blip.tv/",
        selector: ".EpisodeCardLink"
    },
        "http://blip.tv/LTAH/origins-of-the-original-six-montreal-6344702"
    ]
};