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
        /^https?:\/\/twitter\.com\/(?:\w+)\/status(?:es)?\/(?:\w+)(?:\/(video)\/1)?/i,
        /^https?:\/\/pic.twitter\.com\//i
        ],

    mixins: [
        "canonical",
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

                oembed.title = meta['html-title']; //.replace(/Twitter\s*\/?\s*/, " ");

                cb(null, {
                    title: oembed.title,
                    twitter_oembed: oembed
                });
            });
    },

    getMeta: function(twitter_oembed) {
        return {
            title: twitter_oembed.title,
            author: twitter_oembed.author_name,
            author_url: twitter_oembed.author_url,
            site: twitter_oembed.site_name || twitter_oembed.provider_name,
            description: twitter_oembed.html.replace(/<(.*?)>/g, '')
        };
    },

    getLink: function(urlMatch, og, twitter_oembed) {

        var html = twitter_oembed.html.replace('<blockquote class="twitter-tweet"', '<blockquote class="twitter-tweet" align="center"');

        var links = [{
            html: html,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.oembed, CONFIG.R.app, CONFIG.R.inline, CONFIG.R.ssl],
            "min-width": c["min-width"],
            "max-width": c["max-width"]
        }];

        if (og.image && og.image.user_generated) {
            links.push({
                href: og.image.url,
                type: CONFIG.T.image,
                rel: [CONFIG.R.image]
            });
        }

        /*
        if (urlMatch[1] === 'video') {
            html = html.replace(/class="twitter-tweet"/g, 'class="twitter-video"');
            links.push({
                html: html,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.oembed, CONFIG.R.video, CONFIG.R.inline, CONFIG.R.ssl],
                "min-width": c["min-width"],
                "max-width": c["max-width"]
            });
        }
        */

        return links;
    },

    tests: [
        "https://twitter.com/TSwiftOnTour/status/343846711346737153",

        "https://twitter.com/Tackk/status/610432299486814208/video/1",
        "https://twitter.com/BarstoolSam/status/602688682739507200/video/1",
        "https://twitter.com/RockoPeppe/status/582323285825736704?lang=en"  // og-image
    ]
};