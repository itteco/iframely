module.exports = {

    mixins: [
        "canonical",
        "og-title",
        "og-site",
        "twitter-author",

        "og-image",
        "favicon",
        "twitter-player-responsive"
    ],

    tests: [{
        page: "http://www.ustream.tv/new/explore/technology",
        selectr: ".media-data"
        }, 
        "http://www.ustream.tv/thisweekin"
    ]
};