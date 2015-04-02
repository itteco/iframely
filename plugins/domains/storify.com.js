module.exports = {

    re: [
        /^https?:\/\/storify\.com\/([a-zA-Z0-9_\-]+)\/([a-zA-Z0-9_\-]+)/i
    ],

    mixins: [
        "og-site",
        "og-image",
        "twitter-player",
        "favicon"
    ],

    getMeta: function(meta) {
        return {
            title: (meta.og.title || meta["html-title"]).split(" · ")[0],
            author_url: meta.storifyapp && meta.storifyapp.author
        };
    },

    getLink: function(meta) {

        var url = meta.canonical.replace('http:', '');
        var title = (meta.og.title || meta["html-title"]).split(" · ")[0];

        return {
            html: '<div class="storify"><iframe src="' + url + '/embed" width="100%" height="750" frameborder="no" allowtransparency="true"></iframe><script src="' + url + '.js"></script><noscript>[<a href="' + url + '" target="_blank">' + title + '</a>]</noscript></div>',
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.reader, CONFIG.R.ssl, CONFIG.R.inline],
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