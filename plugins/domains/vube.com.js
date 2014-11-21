module.exports = {

    mixins: [
        "og-image",
        "canonical",
        "twitter-description",
        "og-site",
        "twitter-title",
        "favicon"
    ],

    getLink: function(meta) {

        if (!meta.og.url && !meta.twitter.url) return;         

        var urlMatch = (meta.og.url || meta.twitter.url).match(/^https?:\/\/vube\.com\/([^\/]+)\/([a-zA-Z0-9_-]+)$/i);

        if (!urlMatch || urlMatch[1] == "tags") return;

        return {
            href: "http://vube.com/embed/video/" + urlMatch[2] + "?autoplay=false&fit=true",
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 640/435
        }

    },

    tests: [{
        noFeeds: true,
        skipMixins: ['twitter-description']
    },
        "http://vube.com/De5tro/vE6XViQkTU/L/vote?t=s",
        "http://vube.com/SHIBAN/u2QvJwDVmw?t=s"
    ]
};