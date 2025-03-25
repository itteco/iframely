export default {

    re: /^https?:(\/\/[\w-]+\.carto(?:db)?\.com\/(?:u\/[\w-]+\/)?viz\/[a-z0-9-]+)/i,

    mixins: [
        // "oembed-title", oembed title is null :\\
        // no thumbnail in oembed too
        "twitter-title",
        "twitter-image",
        "og-image",
        "oembed-author",
        "oembed-site",
        "keywords",
        "favicon",
        "oembed-iframe"
    ],

    getMeta: function(url, meta) {
        return {
            canonical: url.replace(/\/embed_map/, '/public_map'),
            description: meta.og && meta.og.description && (meta.og.description.split(' — ')[0])
        };
    },

    getLink: function(iframe) {
        return {
            href: iframe.src,
            rel: [CONFIG.R.app, CONFIG.R.map],
            "aspect-ratio": 4/3
        }
    },

    tests: [{
        noFeeds: true
    },
        "https://artbayview.carto.com/viz/f8759b54-a515-11e5-bc9d-0ea31932ec1d/public_map",
        "https://naelshiab.carto.com/viz/ca48508e-3178-11e5-af3e-0e4fddd5de28",
        "https://alasdair.cartodb.com/viz/9d46d8a2-f690-11e5-b0a2-0e31c9be1b51/embed_map",
        "https://smb2stfinitesubs1.cartodb.com/viz/39e625ee-cef3-11e4-b8bb-0e0c41326911/public_map",
        "https://twittereurope.cartodb.com/u/kike-5/viz/456350ba-377e-11e5-8b42-0e853d047bba/public_map",
        "https://bloomberg.cartodb.com/u/eanders/viz/6913f4cc-bd05-11e4-a444-7054d21a95e5/public_map"
    ]
};