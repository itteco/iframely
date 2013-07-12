module.exports = {

    re: [
        /^https?:\/\/www\.flickr\.com\/photos\/([@a-zA-Z0-9_\.]+)\/sets\/(\d+)\/$/i,    // Set.
        /^https?:\/\/www\.flickr\.com\/photos\/([@a-zA-Z0-9_\.]+)\/$/i                  // User's stream.
    ],

    mixins: [
        "og-title",
        "canonical",
        "site",
        "twitter-description",
        "twitter-author",

        "favicon",
        "og-image"
    ],

    getLink: function(url) {
        return {
            href: url + 'show',
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player
        };
    },

    tests: [
        {
            // Flickr sets feed.
            page: "http://www.flickr.com/photos/jup3nep/sets/",
            selector: ".Seta"
        },
        {
            // Flickr users feed.
            feed: "http://api.flickr.com/services/feeds/photos_public.gne",
            getUrl: function(url) {
                var m = url.match(/^(https?:\/\/www\.flickr\.com\/photos\/[@a-zA-Z0-9_\.]+\/)/i);
                if (m) {
                    return m[1];
                }
            }
        },
        "http://www.flickr.com/photos/jup3nep/sets/72157603856136177/",
        "http://www.flickr.com/photos/jup3nep/",
        {
            skipMixins: [
                "twitter-author"
            ]
        }
    ]
};