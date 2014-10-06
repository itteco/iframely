module.exports = {

    re: [
        /^https?:\/\/[\w\.]*instagram\.com\/p\/([a-zA-Z0-9_-]+)/i,
        /^https?:\/\/instagr\.am\/p\/([a-zA-Z0-9_-]+)/i,
        /^https?:\/\/instagram\.com\/p\/([a-zA-Z0-9_-]+)$/i
    ],

    mixins: [
        "oembed-title",
        "oembed-site",
        "oembed-author",

        "favicon"
    ],

    getLinks: function(urlMatch, meta) {
        var src = 'http://instagram.com/p/' + urlMatch[1] + '/media/?size=';
        var embed = '//instagram.com/p/' + urlMatch[1] + '/embed/';

        var links = [
            {
                href: embed,
                type: CONFIG.T.text_html,
                rel: (meta.og && meta.og.video) ? [CONFIG.R.player, CONFIG.R.html5]: CONFIG.R.app,
                width: 616,
                height: 714
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
                rel: (meta.og && meta.og.video) ? CONFIG.R.thumbnail : CONFIG.R.image,
                width: 612,
                height: 612
            }];

        if (meta.og && meta.og.video) {
            links.push({
                href: meta.og.video.url || meta.og.video,
                type: meta.og.video.type || CONFIG.T.maybe_text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
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
        "http://instagram.com/p/HbBy-ExIyF/",
        "http://instagram.com/p/a_v1-9gTHx/",
        {
            skipMixins: [
                "oembed-title"
            ]
        }
    ]
};