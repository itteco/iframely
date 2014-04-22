module.exports = {

    re: /^https?:\/\/(www\.)?ted\.com\/talks\//i,

    mixins: [
        "canonical",
        "oembed-title",
        "video",
        "oembed-author",
        "oembed-site",
        "oembed-thumbnail",
        "oembed-video-responsive",
        "favicon"
    ],

    tests: [{
        page: "http://www.ted.com/talks",
        selector: "#content a"
    },
        "http://www.ted.com/talks/kent_larson_brilliant_designs_to_fit_more_people_in_every_city.html"
    ]
};