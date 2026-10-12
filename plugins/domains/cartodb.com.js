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
        "https://rpa.carto.com/viz/f88c9e55-d216-46af-aac8-41de17fa655f/public_map",
        "https://csis-enterprise.carto.com/u/csis/viz/4c461308-d73e-11e5-9a49-0e3ff518bd15/public_map"
    ]
};