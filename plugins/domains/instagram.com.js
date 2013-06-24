module.exports = {

    re: [
        /^https?:\/\/[\w\.]*instagram\.com\/p\/([a-zA-Z0-9_-]+)/i,
        /^http:\/\/instagr\.am\/p\/([a-zA-Z0-9_-]+)/i,
        /^http:\/\/instagram\.com\/p\/([a-zA-Z0-9_-]+)$/i
    ],

    mixins: [
        "oembed-title",
        "oembed-site",
        "oembed-author"
    ],

    getLinks: function(urlMatch, meta) {
        var src = 'http://instagram.com/p/' + urlMatch[1] +'/media/?size='

        var links = [
            // Favicon.
            {
                "href": "http://d36xtkk24g8jdx.cloudfront.net/bluebar/dd6cb37/images/ico/apple-touch-icon-72x72-precomposed.png",
                "rel": ["apple-touch-icon-precomposed", CONFIG.R.icon],
                "type": CONFIG.T.image_png,
                "width": 72,
                "height": 72
            },

            // Images.
            {
                href: src + 't',
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail,
                width: 150,
                height: 150
            }, {
                href: src + 'm',
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail,
                width: 306,
                height: 306
            }, {
                href: src + 'l',
                type: CONFIG.T.image,
                rel: CONFIG.R.image,
                width: 612,
                height: 612
            }];

        if (meta.og && meta.og.video) {
            links.push({
                href: meta.og.video.url || meta.og.video,
                poster: meta.og.image,
                type: meta.og.video.type || CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.og],
                "aspect-ratio": meta.og.video.width / meta.og.video.height,
                "max-width": meta.og.video.width,
                "max-height": meta.og.video.height
            });
        }

        return links;
    },

    tests: [{
        page: "http://blog.instagram.com/",
        selector: ".photogrid a"
    },
        "http://instagram.com/p/HbBy-ExIyF/"
    ]
};