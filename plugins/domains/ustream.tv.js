module.exports = {

    mixins: [
        "canonical",
        "og-title",
        "og-site",
        "twitter-author",

        "og-image",
        "favicon",
        "twitter-player-responsive-nonhtml5"
    ],

    tests: [{
        page: "http://www.ustream.tv/new/explore/technology",
        selector: ".media-data"
    },
        "http://www.ustream.tv/thisweekin",
        {
            skipMixins: [
                "twitter-author"
            ]
        }
    ]
};