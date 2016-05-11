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
        // "twitter-image",
        "favicon"
    ],

    getLinks: function(oembed, twitter, options) {

        var media_only = options.getProviderOptions('giphy.media_only', false) && oembed.image;

        var links = [];

        if (!media_only && twitter.player) {
            links.push({
                href: twitter.player.value || twitter.player,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.twitter, CONFIG.R.html5, CONFIG.R.gifv],
                "aspect-ratio": twitter.player.width / twitter.player.height
            });
        }

        links.push({
            href: oembed.image,
            type: CONFIG.T.image_gif,
            rel: CONFIG.R.image,
            width: oembed.width,
            height: oembed.height
        });

        links.push({
            href: twitter.image && (twitter.image.src || twitter.image.url),
            type: CONFIG.T.image, // keep it here, otherwise thumbnail may come up with GIF MIME type
            rel: CONFIG.R.thumbnail,
            width: oembed.width,
            height: oembed.height
        });        

        return links;
    },

    tests: [{
        page: 'http://giphy.com',
        selector: '.gif-link'
    },
        "http://giphy.com/gifs/emma-stone-kiss-oHBlKX1wbIye4"
    ]
};