module.exports = {

    re: [
        /^https?:\/\/giphy\.com\/gifs\/([a-z0-9\-]+)/i
    ],

    mixins: [
        "canonical",
        "author",
        "og-site",
        "keywords",
        "og-image",
        "favicon"
    ],

    getMeta: function (meta) {

        return {
            shortlink: meta.og.url
        }

    },

    getLinks: function(urlMatch) {

        // http://media.giphy.com/media/YJ88JyDL61jeo/original.gif
        var original = "http://media.giphy.com/media/" + urlMatch[1] + "/original.gif";

        return {
            href: original,
            type: CONFIG.T.image,
            rel: CONFIG.R.image
        };
    },

    tests: [
        "http://giphy.com/gifs/YJ88JyDL61jeo"
    ]
};