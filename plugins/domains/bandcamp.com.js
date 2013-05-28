module.exports = {

    mixins: [
        "og-title",
        "og-description",
        "og-image",
        "favicon"
    ],

    getMeta: function(meta) {
        return {
            site: "Bandcamp",
            author: meta.og.site_name
        };
    },

    getLink: function(meta) {

        if (!meta.og.video.url) return;

        var og_player_url = meta.og.video.url;
        var id;

        og_player_url.split('/').forEach(function(str) {
            if (str.lastIndexOf('album', 0) === 0 || str.lastIndexOf('track', 0) === 0) {
                id = str;
            }
        });

        if (!id) return;
        
        return {
            href: '//bandcamp.com/EmbeddedPlayer/v=2/' + id + '/size=venti/bgcol=FFFFFF/linkcol=4285BB/',
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            width: 400,
            height: 100
        }
    },

    tests: [{
        feed: "http://mellomusicgroup.bandcamp.com/feed"
    },
        "http://mad-hop.bandcamp.com/track/fracture"
    ]
};