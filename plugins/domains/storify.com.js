module.exports = {

    re: [
        /^https?:\/\/storify\.com\/([a-zA-Z0-9_\-]+)\/([a-zA-Z0-9_\-]+)/i
    ],

    mixins: [
        "og-site",
        "og-image",
        "twitter-player-responsive",
        "favicon"
    ],

    getMeta: function(meta) {
        return {
            title: (meta.og.title || meta["html-title"]).split(" · ")[0],
            author_url: meta.storifyapp && meta.storifyapp.author
        };
    },

    // TODO: add max-width.
    // TODO: add iframe event to parent: update size.

    getLink: function(meta) {

        var src = meta.canonical.replace('http:', '') + '.js';

        return {
            type: CONFIG.T.text_html,
            rel: CONFIG.R.reader,
            html: '<script type="text/javascript" src="' + src + '"></script>',
            "orientation": 'portrait',
            "min-width": 320,
            "max-width": 900
        };
    },

    tests: [{
        feed: "http://storify.com/rss/featured"
    },
        "https://storify.com/miniver/our-leaders-willfully-wrong-response-to-the-econom/",
        "http://storify.com/Kevin_H_Nielsen/nba-draft-live"
    ]
};