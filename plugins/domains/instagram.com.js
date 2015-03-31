module.exports = {

    re: [
        /^https?:\/\/[\w\.]*instagram\.com\/(?:[a-zA-Z0-9_-]+\/)?p\/([a-zA-Z0-9_-]+)/i,
        /^https?:\/\/instagr\.am\/(?:[a-zA-Z0-9_-]+\/)?p\/([a-zA-Z0-9_-]+)/i,
        /^https?:\/\/instagram\.com\/(?:[a-zA-Z0-9_-]+\/)?p\/([a-zA-Z0-9_-]+)$/i
    ],

    mixins: [
        "oembed-title",
        "oembed-site",
        "oembed-author",
        "oembed-thumbnail",

        "favicon"
    ],

    getLinks: function(urlMatch, meta, oembed) {
        var src = 'http://instagram.com/p/' + urlMatch[1] + '/media/?size=';

        var links = [
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
                rel: (meta.og && meta.og.video) ? CONFIG.R.thumbnail : CONFIG.R.image,
                width: 612,
                height: 612
            }];

        if (meta.og && meta.og.video) {
            links.push({
                href: meta.og.video.url,
                type: meta.og.video.type || CONFIG.T.maybe_text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": meta.og.video.width / meta.og.video.height
            });
            links.push({
                href: meta.og.video.secure_url,
                type: meta.og.video.type || CONFIG.T.maybe_text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": meta.og.video.width / meta.og.video.height
            });
        } else {
            links.push({
                href: oembed.thumbnail_url,
                type: CONFIG.T.image_jpeg,
                rel: CONFIG.R.image,
                width: oembed.thumbnail_width,
                height: oembed.thumbnail_height
            });
        }

        if (oembed.type === 'rich') {
            links.push({
                html: oembed.html,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5, CONFIG.R.inline]
            });
        }

        return links;
    },

    tests: [{
        page: "http://blog.instagram.com/",
        selector: ".photogrid a"
    },
        "http://instagram.com/p/HbBy-ExIyF/",
        "http://instagram.com/p/a_v1-9gTHx/",
        {
            skipMixins: [
                "oembed-title"
            ]
        }
    ]
};