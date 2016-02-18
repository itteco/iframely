var async = require('async');
var cache = require('../../lib/cache');
var sysUtils = require('../../logging');
var _ = require('underscore');
var crypto = require('crypto'); // temp

module.exports = {

    re: [
        /^https?:\/\/twitter\.com\/(?:\w+)\/status(?:es)?\/(\d+)/i
    ],

    provides: ['twitter_oembed', 'twitter_video', '__allow_twitter_video'],

    mixins: ['domain-icon'],

    getData: function(urlMatch, request, options, cb) {
        var id = urlMatch[1];

        var c = options.getProviderOptions("twitter") || options.getProviderOptions("twitter.status");

        if (c.disabled) {
            return cb('Twitter API Disabled');
        }

        var oauth = {
            consumer_key: c.consumer_key,
            consumer_secret: c.consumer_secret,
            token: c.access_token,
            token_secret: c.access_token_secret
        };

        async.waterfall([

            function(cb) {

                var url = "https://api.twitter.com/1/statuses/oembed.json";

                var qs = {
                    id: id,
                    hide_media: c.hide_media,
                    hide_thread: c.hide_thread,
                    omit_script: c.omit_script
                };

                var cache_key = '"' + crypto.createHash('md5').update(JSON.stringify({
                        url: 'https://api.twitter.com/1.1/statuses/oembed.json',
                        qs: qs,
                        oauth: oauth,
                        json: true
                    })).digest("hex") + '"';

                request({
                    url: url,
                    qs: qs,
                    json: true,
                    cache_key: cache_key,
                    new_cache_key: 'twitter:oembed:' + id,
                    ttl: c.cache_ttl,
                    prepareResult: function(error, response, data, cb) {

                        if (error) {
                            return cb(error);
                        }

                        if (response.statusCode !== 200) {
                            return cb('Non-200 response from Twitter API (statuses/oembed.json: ' + response.statusCode);
                        }

                        if (typeof data !== 'object') {
                            return cb('Object expected in Twitter API (statuses/oembed.json), got: ' + data);
                        }

                        cb(error, data);
                    }
                }, cb);
            }

        ], function(error, oembed) {


            if (error) {
                return cb(error);
            }

            oembed.title = oembed.author_name + ' on Twitter';

            oembed["min-width"] = c["min-width"];
            oembed["max-width"] = c["max-width"];

            var result = {
                twitter_oembed: oembed,                
            };

            if (c.media_only) {
                result.__allow_twitter_video = true;
            } else {
                result.twitter_video = false;
            }

            cb(null, result);
        });
    },

    getMeta: function(twitter_oembed) {
        return {
            title: twitter_oembed.title,
            author: twitter_oembed.author_name,
            author_url: twitter_oembed.author_url,
            site: twitter_oembed.site_name || twitter_oembed.provider_name,
            description: twitter_oembed.html.replace(/<(.*?)>/g, ''),
            canonical: twitter_oembed.url
        };
    },

    getLink: function(twitter_oembed, twitter_video, options) {

        var html = twitter_oembed.html;

        if (options.getProviderOptions('twitter.center', true)) {
            html = html.replace('<blockquote class="twitter-tweet"', '<blockquote class="twitter-tweet" align="center"');
        }

        var links = [];

        if (twitter_video) {

            html = html.replace(/class="twitter-tweet"/g, 'class="twitter-video"');
            links.push({
                html: html,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.inline, CONFIG.R.ssl, CONFIG.R.html5],
                "aspect-ratio": twitter_video.width / twitter_video.height
            });

        } else {

            links.push({
                html: html,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.inline, CONFIG.R.ssl, CONFIG.R.html5],
                "min-width": twitter_oembed["min-width"],
                "max-width": twitter_oembed["max-width"]
            });
        }

        return links;
    },

    tests: [
        "https://twitter.com/TSwiftOnTour/status/343846711346737153",

        "https://twitter.com/Tackk/status/610432299486814208/video/1",
        "https://twitter.com/BarstoolSam/status/602688682739507200/video/1",
        "https://twitter.com/RockoPeppe/status/582323285825736704?lang=en"  // og-image
    ]
};