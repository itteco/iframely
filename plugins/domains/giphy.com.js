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
        "favicon"
    ],

    getLinks: function(oembed, twitter, options) {

        var media_only = options.getProviderOptions('giphy.media_only', false) && oembed.image;

        var links = [];

        if (!media_only) {
            links.push({
                href: twitter.player.value || twitter.player,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.twitter],
                width: twitter.player.width,
                height: twitter.player.height
            });
        }

        links.push({
            href: oembed.image,
            type: CONFIG.T.image_gif,
            rel: CONFIG.R.image,
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