var async = require('async');
var cache = require('../../../lib/cache');
var sysUtils = require('../../../logging');
var _ = require('underscore');
var entities = require('entities');

module.exports = {

    re: [
        /^https?:\/\/twitter\.com\/(?:\w+)\/status(?:es)?\/(\d+)/i
    ],

    provides: ['twitter_oembed', 'twitter_og', '__allow_twitter_og'],

    mixins: ['domain-icon'],

    getData: function(urlMatch, request, options, cb) {
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
                    hide_media:  options.getProviderOptions(CONFIG.O.full, false) ? false : c.hide_media, 
                    hide_thread: options.getProviderOptions(CONFIG.O.full, false) ? false : c.hide_thread,
                    omit_script: c.omit_script
                };

                if (usePublicApi) {
                    apiUrl = "https://publish.twitter.com/oembed";
                    qs.url = urlMatch[0];
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

            if (c.media_only || options.getProviderOptions(CONFIG.O.compact, false) || /pic\.twitter\.com/i.test(oembed.html)) {
                result.__allow_twitter_og = true;
                options.followHTTPRedirect = true; // avoid core's re-directs. Use HTTP request redirects instead
            } else {
                result.twitter_og = false;
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
            description: entities.decodeHTML(twitter_oembed.html.replace(/<(.*?)>/g, '')),
            canonical: twitter_oembed.url
        };
    },

    getLink: function(twitter_oembed, twitter_og, options) {

        var c = options.getProviderOptions("twitter") || options.getProviderOptions("twitter.status");
        var html = twitter_oembed.html;

        if (options.getProviderOptions('twitter.center', true)) {
            html = html.replace('<blockquote class="twitter-tweet"', '<blockquote class="twitter-tweet" align="center"');
        }

        var locale = options.getProviderOptions('locale');
        if (locale && /^\w{2}(?:\_|\-)\w{2,3}$/.test(locale)) {
            html = html.replace(/<blockquote class="twitter\-tweet"( data\-lang="\w+(?:\_|\-)\w+")?/, '<blockquote class="twitter-tweet" data-lang="' + locale.replace('-', '_') + '"');
        }

        var links = [];

        if (((c.media_only && !options.getProviderOptions(CONFIG.O.full, false)) || options.getProviderOptions(CONFIG.O.compact, false)) 
            && twitter_og && twitter_og.video && twitter_og.image 
            && /^https?:\/\/pbs\.twimg\.com\/(?:media|amplify|ext_tw)/i.test(twitter_og.image.url || twitter_og.image.src || twitter_og.image) ) {            
            // exclude not embedable videos with proxy images, ex:
            // https://twitter.com/nfl/status/648185526034395137

            html = html.replace(/class="twitter-tweet"/g, 
                'class="twitter-video"' + (options.getProviderOptions('twitter.hide_tweet') ? ' data-status="hidden"': ''));            

            links.push({
                html: html,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.inline, CONFIG.R.ssl, CONFIG.R.html5],
                "aspect-ratio": twitter_og.video.width / twitter_og.video.height,
                "max-width": 888 // good one, Twitter!
            });

        } else {

            if (options.getProviderOptions(CONFIG.O.full, false)) {
                html = html.replace(/\s?data-conversation=\"none\"/, '');
            }

            var app = {
                html: html,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.inline, CONFIG.R.ssl, CONFIG.R.html5],
                "max-width": twitter_oembed["width"] || 550
            };

            if ((/https:\/\/t\.co\//i.test(twitter_oembed.html) && !/pic\.twitter\.com\//i.test(twitter_oembed.html)) // there's a link and a card inside the tweet
                || (twitter_og.image && !(twitter_og.image.user_generated || /\/profile_images\//i.test(twitter_og.image)))) { // user_generated is string = 'true' for pics
                app['aspect-ratio'] = 1;
            }

            links.push(app);
        }

        if (twitter_og && twitter_og.image && 
            !/\/profile_images\//i.test(twitter_og.image.url || twitter_og.image.src || twitter_og.image)) {
            // skip profile pictures

            var thumbnail = {
                href: twitter_og.image.url || twitter_og.image.src || twitter_og.image,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
            };

            if (twitter_og.video && twitter_og.video.width && twitter_og.video.height) {
                thumbnail.width = twitter_og.video.width;
                thumbnail.height = twitter_og.video.height;
            }

            links.push(thumbnail);

        }        

        return links;
    },

    tests: [
        "https://twitter.com/TSwiftOnTour/status/343846711346737153",

        "https://twitter.com/Tackk/status/610432299486814208/video/1",
        "https://twitter.com/RockoPeppe/status/582323285825736704?lang=en"  // og-image
    ]
};