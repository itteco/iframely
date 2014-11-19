module.exports = {

    re: [
        /^https?:\/\/giphy\.com\/gifs\/([a-z0-9\-]+)/i
    ],

    mixins: [
        "canonical",
        "author",
        "og-site",
        "og-title",
        "keywords",
        "twitter-image",
        "twitter-player-responsive",
        "favicon"
    ],

    getLinks: function(urlMatch) {

        var id = urlMatch[1].split('-').slice(-1)[0];

        // http://media.giphy.com/media/YJ88JyDL61jeo/original.gif
        var original = "http://media.giphy.com/media/" + id  + "/giphy.gif";

        return {
            href: original,
            type: CONFIG.T.image,
            rel: CONFIG.R.image
        };
    },

    tests: [{
        page: 'http://giphy.com',
        selector: '.gif-link'
    },
        "http://giphy.com/gifs/emma-stone-kiss-oHBlKX1wbIye4"
    ]
};