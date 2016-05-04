var async = require('async');
var cache = require('../../lib/cache');
var sysUtils = require('../../logging');
var _ = require('underscore');

module.exports = {

    re: [
        /^https?:\/\/twitter\.com\/(?:\w+)\/status(?:es)?\/(\d+)/i
    ],

    provides: ['twitter_oembed', 'twitter_video', '__allow_twitter_video'],

    mixins: ['domain-icon'],

    getData: function(url, urlMatch, request, options, cb) {
        var id = urlMatch[1];

        var c = options.getProviderOptions("twitter") || options.getProviderOptions("twitter.status");

        if (c.disabled) {
            return cb('Twitter API Disabled');
        }

        var oauth = c.consumer_key 
            ? {
                consumer_key: c.consumer_key,
                consumer_secret: c.consumer_secret,
                token: c.access_token,
                token_secret: c.access_token_secret
            } : false;

        var blockExpireIn = 0;
        var block_key = 'twbl:' + c.consumer_key;

        async.waterfall([

            function(cb) {

                if (oauth) {
                    cache.get(block_key, cb);
                } else {
                    cb(null, null);
                }
            },

            function(expireIn, cb) {

                if (expireIn) {
                    var now = Math.round(new Date().getTime() / 1000);
                    if (expireIn > now) {
                        blockExpireIn = expireIn - now;
                    }
                }

                var usePublicApi = !oauth || blockExpireIn > 0;

                var apiUrl;

                var qs = {
                    hide_media: c.hide_media,
                    hide_thread: c.hide_thread,
                    omit_script: c.omit_script
                };

                if (usePublicApi) {
                    apiUrl = "https://publish.twitter.com/oembed";
                    qs.url = url;
                } else {
                    apiUrl = "https://api.twitter.com/1.1/statuses/oembed.json";
                    qs.id = id;
                }

                request(_.extend({
                    url: apiUrl,
                    qs: qs,
                    json: true,
                    cache_key: 'twitter:oembed:' + id,
                    ttl: c.cache_ttl,
                    prepareResult: function(error, response, data, cb) {

                        if (error) {
                            return cb(error);
                        }

                        if (response.fromRequestCache) {
                            if (blockExpireIn > 0) {
                                sysUtils.log('   -- Twitter API limit reached (' + blockExpireIn + ' seconds left), but cache used.');
                            } else {
                                sysUtils.log('   -- Twitter API cache used.');
                            }
                        }

                        // Do not block 1.1 api if data from cache.
                        if (oauth && !response.fromRequestCache) {

                            var remaining = parseInt(response.headers['x-rate-limit-remaining']);

                            if (response.statusCode === 429 || remaining <= 7) {
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

                                if (response.statusCode === 429) {
                                    sysUtils.log('   -- Twitter API limit reached by status code 429. Disabling for ' + ttl + ' seconds.');
                                } else {
                                    sysUtils.log('   -- Twitter API limit warning, remaining calls: ' + remaining + '. Disabling for ' + ttl + ' seconds.');
                                }

                                // Store expire date as value to be sure it past.
                                var expireIn = now + ttl;

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
                }, usePublicApi ? null : {oauth: oauth}), cb); // add oauth if 1.1, else skip it

            }

        ], function(error, oembed) {


            if (error) {
                return cb(error);
            }

            oembed.title = oembed.author_name + ' on Twitter';

            oembed["min-width"] = c["min-width"];
            oembed["max-width"] = c["max-width"];

            var result = {
                twitter_oembed: oembed
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