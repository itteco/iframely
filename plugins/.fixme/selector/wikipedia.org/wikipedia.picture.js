module.exports = {

    re: /http:\/\/\w+\.wikipedia\.org\/wiki\/File:/i,

    mixins: [
        "wikimedia.picture"
    ],

    tests: [{
        page: "http://en.wikipedia.org/wiki/Wikipedia:Featured_pictures",
        selector: "dd a.image"
    },
        "http://en.wikipedia.org/wiki/File:F-16_June_2008.jpg",
        "http://en.wikipedia.org/wiki/File:Morning_Energy_-_Ardrossan_Wind_Farm_From_Portencross_-_geograph.org.uk_-_1088264.jpg"
    ]
};