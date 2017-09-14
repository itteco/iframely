module.exports = {

    re: [
        /^https?:\/\/giphy\.com\/gifs\/([a-z0-9\-]+)/i
    ],

    mixins: [
        "canonical",
        "author",
        "oembed-site",
        "oembed-title",
        "keywords",
        // "twitter-image",
        "domain-icon"
    ],

    getLinks: function(oembed, twitter, options) {

        var media_only = options.getProviderOptions('giphy.media_only', false) && oembed.image;

        var links = [];

        if (!media_only && twitter.player) {

            var href = (twitter.player.value || twitter.player).replace(/\/twitter\/iframe$/, '');
            if (href.indexOf('?') == -1 && options.getProviderOptions('giphy.get_params', false)) {
                href+= (options.getProviderOptions('giphy.get_params').indexOf('?') > -1 ? '' : '?') + options.getProviderOptions('giphy.get_params');
            }

            links.push({
                href: href,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.twitter, CONFIG.R.html5, CONFIG.R.gifv],
                "aspect-ratio": twitter.player.width / twitter.player.height
            });
        }

        if (oembed.type == 'photo') {

            links.push({
                href: oembed.image || oembed.url,
                type: CONFIG.T.image_gif,
                rel: CONFIG.R.image,
                width: oembed.width,
                height: oembed.height
            });
        }

        var thumbnail = twitter.image && (twitter.image.src || twitter.image.url); 

        if (oembed.width && oembed.height && (oembed.width / oembed.height < 1.7 || oembed.width / oembed.height > 1.9)) {
            // fix resized thumbnail 
            // from https://media.giphy.com/media/.../giphy-facebook_s.jpg?t=1
            // to https://media3.giphy.com/media/.../giphy_s.gif

            thumbnail = thumbnail.replace(/\/giphy\-facebook_s\.jpg\?t=1$/, '/giphy_s.gif?t=1');
        }

        links.push({
            href: thumbnail,
            type: CONFIG.T.image, // keep it here, otherwise thumbnail may come up with GIF MIME type
            rel: CONFIG.R.thumbnail,
            width: oembed.width,
            height: oembed.height
        });        

        return links;
    },

    tests: [{
        skipMixins: ["oembed-canonical"]
    },
        "http://giphy.com/gifs/emma-stone-kiss-oHBlKX1wbIye4",
        "http://giphy.com/gifs/art-artists-on-tumblr-design-uRmDTQDgYxSzS",
        "http://giphy.com/gifs/idk-shrug-shrugging-aXSLMy6fDsI4E"
    ]
};