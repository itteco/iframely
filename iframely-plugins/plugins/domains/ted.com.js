module.exports = {

    mixins: [
        "oembed-title",
        "oembed-thumbnail",
        "oembed-video-responsive"
    ],

    tests: [{
        page: "http://www.ted.com/talks",
        selectr: "#content a"
    },
        "http://www.ted.com/talks/kent_larson_brilliant_designs_to_fit_more_people_in_every_city.html"
    ]
};