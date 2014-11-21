module.exports = {

    re: /^https?:\/\/(?:www\.)?ted\.com\/talks\//i,

    mixins: [
        "oembed-video-responsive",
        "og-image",
        "oembed-thumbnail",
        "favicon",
        "oembed-author",
        "oembed-canonical",
        "og-description",
        "keywords",
        "oembed-site",
        "oembed-title"
    ],

    tests: [{
        page: "http://www.ted.com/talks",
        selector: "#browse-results a"
    },
        "http://www.ted.com/talks/kent_larson_brilliant_designs_to_fit_more_people_in_every_city"
    ]
};