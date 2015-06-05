module.exports = {

    re: [
        /^https?:\/\/giphy\.com\/gifs\/([a-z0-9\-]+)/i
    ],

    mixins: [
        "oembed-canonical",
        "author",
        "oembed-site",
        "oembed-title",
        "keywords",
        "twitter-image",
        "twitter-player",
        "favicon"
    ],

    getLinks: function(oembed) {

        return {
            href: oembed.image,
            type: CONFIG.T.image_gif,
            rel: CONFIG.R.image,
            width: oembed.width,
            height: oembed.height
        };
    },

    tests: [{
        page: 'http://giphy.com',
        selector: '.gif-link'
    },
        "http://giphy.com/gifs/emma-stone-kiss-oHBlKX1wbIye4"
    ]
};