var c = CONFIG.providerOptions["twitter.status"];

var OAuth= require('oauth').OAuth;
oa = new OAuth("https://twitter.com/oauth/request_token",
    "https://twitter.com/oauth/access_token",
    c.consumer_key,
    c.consumer_secret,
    "1.0A", CONFIG.baseAppUrl + "/oauth/callback", "HMAC-SHA1");

var url = require("url");

module.exports = {

    re: [
        /https:\/\/twitter\.com\/(\w+)\/status\/(\w+)/i,
        /https?:\/\/pic.twitter\.com\//i
        ],

    mixins: [
        "oembed-author",
        "canonical",
        "description",
        "oembed-site",
        "favicon"
    ],

    getLink: function(meta, cb) {

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

                var title = meta['html-title'].replace(/Twitter\s*\/?\s*/, " ");

                 cb(null, {
                     title: title,
                     type: CONFIG.T.text_html,
                     rel: [CONFIG.R.oembed, CONFIG.R.reader],
                     template_context: {
                         title: title,
                         html: oembed.html
                     },
                     "min-width": c["min-width"],
                     "max-width": c["max-width"]
                 });
            });
    },

    tests: [{
        page: "https://twitter.com/TSwiftOnTour",
        selector: ".tweet-timestamp"
    },
        "https://twitter.com/TSwiftOnTour/status/343846711346737153"
    ]
};