var gUtils = require('./utils');

module.exports = {

    re: /^https?:\/\/www\.flickr\.com\/photos\/([@a-zA-Z0-9_\.\-]+)\/(\d+).*?$/i,

    mixins: [
        "oembed-title",
        "oembed-author",
        "oembed-license",
        "oembed-site",
        "domain-icon"
    ],

    getLink: function(oembed) {

        var result =  [{
            html: oembed.html.replace(/width=\"\d+\" height=\"\d+\" alt/, 'width="100%" alt'),
            rel: [oembed.type === 'photo' ? CONFIG.R.image : CONFIG.R.player, CONFIG.R.ssl, CONFIG.R.inline, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            "aspect-ratio": oembed.width / oembed.height
        } , {
            href: oembed.thumbnail_url,
            rel: CONFIG.R.thumbnail,
            type: CONFIG.T.image_jpeg,
            width: oembed.thumbnail_width,
            height: oembed.thumbnail_height 
        }];

        if (oembed.type === 'photo') {
            result.push ({
                href: oembed.url,
                rel: [CONFIG.R.image, CONFIG.R.thumbnail],
                type: CONFIG.T.image_jpeg,
                width: oembed.width,
                height: oembed.height
            });
        }

        return result;
    },

    tests: [{
        feed: "http://api.flickr.com/services/feeds/photos_public.gne"
    },
        "http://www.flickr.com/photos/jup3nep/8243797061/?f=hp",
        "https://www.flickr.com/photos/marshal-banana/23869537421",
        "http://www.flickr.com/photos/gonzai/6027481335/in/photostream/",
        {
            skipMixins: [
                "oembed-title",
                "oembed-author",
                "oembed-license"
            ]
        }
    ]
};