var async = require('async');
var cache = require('../../lib/cache');
var sysUtils = require('../../utils');
var _ = require('underscore');

module.exports = {

    re: [
        /^https?:\/\/twitter\.com\/(?:\w+)\/status(?:es)?\/(\d+)/i
    ],

    provides: 'twitter_oembed',

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

        var block_key = 'twbl:' + c.consumer_key;

        async.waterfall([

            function(cb) {
                cache.get(block_key, cb);
            },

            function(expireIn, cb) {

                if (expireIn) {
                    var now = Math.round(new Date().getTime() / 1000);
                    if (expireIn > now) {
                        sysUtils.log('   -- Twitter API limit reached, plugin temporary disabled for ' + (expireIn - now) + ' seconds.');
                        return cb('Twitter API limit reached, wait ' + (expireIn - now) + ' seconds.');
                    }
                }

                async.parallel({

                    oembed: function(cb) {

                        var url = "https://api.twitter.com/1.1/statuses/oembed.json";

                        var qs = {
                            id: id,
                            hide_media: c.hide_media,
                            hide_thread: c.hide_thread,
                            omit_script: c.omit_script
                        };

                        request({
                            url: url,
                            qs: qs,
                            oauth: oauth,
                            json: true,
                            prepareResult: function(error, response, data, cb) {

                                // Do not block api if data from cache.
                                if (!response.fromRequestCache) {

                                    var remaining = parseInt(response.headers['x-rate-limit-remaining']);

                                    if (response.statusCode === 429 || remaining <= 6) {
                                        var now = Math.round(new Date().getTime() / 1000);
                                        var limitResetAt = parseInt(response.headers['x-rate-limit-reset']);
                                        var ttl = limitResetAt - now;

                                        // Do not allow ttl 0.
                                        // 5 seconds - to cover possible time difference with twitter.
                                        if (ttl < 5) {
                                            ttl = 5;
                                        }

                                        // Block maximum for 15 minutes.
                                        if (ttl > 15*60) {
                                            ttl = 15*60
                                        }

                                        var expireIn = now + ttl;

                                        if (response.statusCode === 429) {
                                            sysUtils.log('   -- Twitter API limit reached by status code 429. Disabling for ' + ttl + ' seconds.');
                                        } else {
                                            sysUtils.log('   -- Twitter API limit warning, remaining calls: ' + remaining + '. Disabling for ' + ttl + ' seconds.');
                                        }

                                        cache.set(block_key, expireIn, {ttl: ttl});
                                    }
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
                    },

                    post: function(cb) {

                        var show_video = c.media_only;

                        if (show_video) {

                            var url = "https://api.twitter.com/1.1/statuses/show.json";

                            var qs = {
                                id: id
                            };

                            request({
                                url: url,
                                qs: qs,
                                oauth: oauth,
                                json: true,
                                prepareResult: function(error, response, data, cb) {

                                    if (response.statusCode !== 200) {
                                        return cb('Non-200 response from Twitter API (statuses/show.json): ' + response.statusCode);
                                    }

                                    if (typeof data !== 'object') {
                                        return cb('Object expected in Twitter API (statuses/show.json), got: ' + data);
                                    }

                                    var is_video = !!_.find(data.extended_entities && data.extended_entities.media, function(m) {
                                        return m.video_info && m.type === "video";
                                    });

                                    cb(error, {
                                        is_video: is_video
                                    });
                                }
                            }, cb);

                        } else {
                            cb(null, null);
                        }
                    }
                }, cb);
            }

        ], function(error, data) {

            if (error) {
                return cb(error);
            }

            // Oembed.

            var oembed = data.oembed;

            oembed.title = oembed.author_name + ' on Twitter';

            oembed["min-width"] = c["min-width"];
            oembed["max-width"] = c["max-width"];

            // Post data.

            oembed.is_video = data.post && data.post.is_video;

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
            site: twitter_oembed.site_name || twitter_oembed.provider_name,
            description: twitter_oembed.html.replace(/<(.*?)>/g, ''),
            canonical: twitter_oembed.url
        };
    },

    getLink: function(twitter_oembed, options) {

        var html = twitter_oembed.html;

        if (options.getProviderOptions('twitter.center', true)) {
            html = html.replace('<blockquote class="twitter-tweet"', '<blockquote class="twitter-tweet" align="center"');
        }

        var links = [];

        if (twitter_oembed.is_video) {

            html = html.replace(/class="twitter-tweet"/g, 'class="twitter-video"');
            links.push({
                html: html,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.oembed, CONFIG.R.player, CONFIG.R.inline, CONFIG.R.ssl],
                "min-width": twitter_oembed["min-width"],
                "max-width": twitter_oembed["max-width"]
            });

        } else {

            links.push({
                html: html,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.oembed, CONFIG.R.app, CONFIG.R.inline, CONFIG.R.ssl],
                "min-width": twitter_oembed["min-width"],
                "max-width": twitter_oembed["max-width"]
            });
        }

        links.push({
            href: "https://abs.twimg.com/favicons/favicon.ico",
            type: CONFIG.T.image_icon,
            rel: CONFIG.R.icon
        })

        /*
        // forget about image for now - it takes 500 ms to verify its size
        if (og.image && og.image.user_generated) {
            links.push({
                href: og.image.url,
                type: CONFIG.T.image,
                rel: [CONFIG.R.image]
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