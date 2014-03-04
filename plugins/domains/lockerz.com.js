module.exports = {

    re: [
        /^http:\/\/lockerz\.com\/u\/([^/]+\/decalz\/[^/]+\/[a-z0-9_-]+)/i
    ],

    mixins: [
        "canonical",
        "author",
        "og-title",
        "twitter-image-rel-image"
    ],

    getMeta: function() {
        return {
            site: "Lockerz"
        };
    },

    getLink: function() {
        return {
            href: "http://lockerz.com/favicon.ico",
            rel: CONFIG.R.icon,
            type: CONFIG.T.image
        };
    },    

    tests: [ 
        "http://lockerz.com/u/patricia.varela/decalz/25781980/louis_3"
    ]
};