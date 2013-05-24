module.exports = {

    mixins: [
        "og-title",
        "og-description",
        "og-video",
        "og-image"
    ],

    getMeta: function(meta) {
        return {
            site: "Bandcamp",
            author: meta.og.site_name
        };
    },

    tests: [{
        feed: "http://mellomusicgroup.bandcamp.com/feed"
    },
        "http://mad-hop.bandcamp.com/track/fracture"
    ]
};