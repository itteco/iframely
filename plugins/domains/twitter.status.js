var c = CONFIG.providerOptions["twitter.status"];

var OAuth= require('oauth').OAuth,
    oa = new OAuth("https://twitter.com/oauth/request_token",
        "https://twitter.com/oauth/access_token",
        c.consumer_key,
        c.consumer_secret,
        "1.0A", CONFIG.baseAppUrl + "/oauth/callback", "HMAC-SHA1");

var url = require("url");

module.exports = {

    re: [
        /https:\/\/twitter\.com\/(\w+)\/status(?:es)?\/(\w+)/i,
        /https?:\/\/pic.twitter\.com\//i
        ],

    mixins: [
        "canonical",
        "description",
        "favicon"
    ],

    provides: 'twitter_oembed',

    getData: function(meta, cb) {
        var m = meta.canonical.split(/(\d+)$/);
        if (!m) {
            return cb();
        }
        var id = m[1];

        var uri = url.parse("https://api.twitter.com/1.1/statuses/oembed.json");
        uri.query = {
            id: id,
            hide_media: c.hide_media,
            hide_thread: c.hide_thread,
            omit_script: c.omit_script
        };

        // TODO: cache!
        oa.get(
            url.format(uri),
            c.access_token,
            c.access_token_secret,
            function(error, data) {

                if (error) {
                    return cb(error);
                }

                var oembed = JSON.parse(data);

                oembed.title = meta['html-title'].replace(/Twitter\s*\/?\s*/, " ");

                cb(null, {
                    twitter_oembed: oembed
                });
            });
    },

    getMeta: function(twitter_oembed) {
        return {
            title: twitter_oembed.title,
            author: twitter_oembed.author_name,
            author_url: twitter_oembed.author_url,
            site: twitter_oembed.site_name || twitter_oembed.provider_name
        };
    },

    getLink: function(twitter_oembed) {

        return {
            type: CONFIG.T.text_html,
            html: twitter_oembed.html,
            rel: [CONFIG.R.oembed, CONFIG.R.reader, CONFIG.R.inline],
            "min-width": c["min-width"],
            "max-width": c["max-width"]
        };
    },

    tests: [
        "https://twitter.com/TSwiftOnTour/status/343846711346737153"
    ]
};