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
        "https://rpa.carto.com/viz/9a23d690-6e00-4c87-8d06-608d8bf7ca18/embed_map",
        "https://samswey.carto.com/viz/e1005588-93d2-47b6-9a61-f4c0ed001163/embed_map",
        "https://bloomberg.carto.com/u/eanders/viz/6913f4cc-bd05-11e4-a444-7054d21a95e5/public_map"
    ]
};