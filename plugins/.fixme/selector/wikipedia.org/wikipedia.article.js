module.exports = {

    mixins: [
        "wikimedia.article"
    ],

    tests: [{
        page: "http://en.wikipedia.org/wiki/Wikipedia:Featured_articles",
        selector: "tr:nth-child(3) a"
    },
        "http://en.wikipedia.org/wiki/Comparison_of_European_road_signs"
    ]
};