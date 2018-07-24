var cheerio = require('cheerio');

module.exports = {

    re: /^https?:(\/\/\w+\.carto(?:db)?\.com\/(?:u\/[\w-]+\/)?viz\/[a-z0-9-]+)/i,

    mixins: [
        // "oembed-title", oembed title is null :\\
        // no thumbnail in oembed too
        "twitter-title",
        "twitter-image",
        "og-image",
        "oembed-author",
        "oembed-site",
        "keywords",
        "favicon"
    ],

    getMeta: function(url, meta) {
        return {
            canonical: url.replace(/\/embed_map/, '/public_map'),
            description: meta.og && meta.og.description && (meta.og.description.split(' — ')[0])
        };
    },

    getLink: function(oembed) {

        var $container = cheerio('<div>');
        try {
            $container.html(oembed.html5 || oembed.html);
        } catch (ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {

            return {
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5],
                "aspect-ratio": 4/3,
                "padding-bottom": 30
                // aspect 4:3 is better than height=520px and width=100%
            };
        }

    },

    tests: [{
        noFeeds: true
    },
        "http://team.cartodb.com/u/andrew/viz/9ee7f88c-b530-11e4-8a2b-0e018d66dc29/public_map",
        "https://team.cartodb.com/u/andrew/viz/9ee7f88c-b530-11e4-8a2b-0e018d66dc29/embed_map",
        "https://smb2stfinitesubs1.cartodb.com/viz/39e625ee-cef3-11e4-b8bb-0e0c41326911/public_map",
        "https://twittereurope.cartodb.com/u/kike-5/viz/456350ba-377e-11e5-8b42-0e853d047bba/public_map",
        "https://bloomberg.cartodb.com/u/eanders/viz/6913f4cc-bd05-11e4-a444-7054d21a95e5/public_map"
    ]
};