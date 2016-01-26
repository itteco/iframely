module.exports = {

    re: [
        /^https?:\/\/videos\.nymag\.com\/video\/([a-zA-Z0-9\-]+)/i,
        /^https?:\/\/videos\.nymag\.com\/list\/\w+\/video\/([a-zA-Z0-9\-]+)/i
    ],

    mixins: [
        "og-title",
        "og-image",
        "og-site",
        "og-description",
        "favicon"
    ],

    getLink: function(urlMatch, meta) {

        return {
            title: meta['html-title'].split('"').slice(1,-1).join('"'),
            href: 'http://videos.nymag.com/video/'+ urlMatch[1] +'/player?layout=&title_height=0',
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 1.53
        };
    },

    tests: [{
        page: "http://videos.nymag.com/watch/recent",
        selector: ".mvp_grid_panel_title a"
    },
        "http://videos.nymag.com/video/Models-Studio-Jourdan-Dunn-2;toprated",
        {
            skipMixins: ["og-description", "favicon"]
        }
    ]
};