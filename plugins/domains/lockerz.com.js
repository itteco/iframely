module.exports = {

    re: [
        /^http:\/\/lockerz.com\/u\/([^/]+\/decalz\/[^/]+\/[a-z0-9_-]+)/i
    ],

    mixins: [
        "canonical",
        "favicon",
        "author",
        "og-title",
        "twitter-image-rel-image"
    ],

    getMeta: function() {
        return {
            site: "Lockerz"
        };
    },

    tests: [ 
        "http://lockerz.com/u/patricia.varela/decalz/25781980/louis_3"
    ]
};