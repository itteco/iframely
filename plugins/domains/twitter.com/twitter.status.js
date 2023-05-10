import * as entities from 'entities';

export default {

    re: [/^https?:\/\/twitter\.com\/(?:\w+)\/status(?:es)?\/(\d+)/i],

    provides: ['twitter_oembed', 'twitter_og', '__allowTwitterOg'],

    mixins: ['domain-icon'],

    getData: function(urlMatch, request, log, options, cb) {

        var hide_media = options.getProviderOptions("twitter.hide_media");
        var omit_script = options.getProviderOptions("twitter.omit_script");

        if (options.getProviderOptions("twitter.disabled", false)) {
            return cb('Twitter API disabled');
        }

        request({
            url: "https://publish.twitter.com/oembed",
            qs: {
                hide_media:  hide_media, 
                hide_thread: true, //  hide_thread - now handled in getLinks. This is the only reliable way to detect if a tweet has the thread
                omit_script: omit_script,
                url: urlMatch[0]
            },
            // json: true,  // Causes issues on 404 when it's not in JSON format, we need result code here. 
                            // When response is OK and is JSON, `fetchData` in fetch.js will see `application/json` and will convert to JSON on its own.
            cache_key: 'twitter:oembed:' + urlMatch[1],
            prepareResult: function(error, response, oembed, cb) {

                if (error) {
                    return cb(error);
                }

                if (response.fromRequestCache) {
                    log('   -- Twitter API cache used.');
                }

                if (response.statusCode === 404) {
                    return cb({
                        responseStatusCode: 404,
                        message: 'The tweet is no longer available.'
                    })

                } else if (response.statusCode === 403) {
                    return cb({
                        responseStatusCode: 404,
                        message: 'It looks this Twitter account has been suspended.'
                    })

                } else if (response.statusCode !== 200) {
                    return cb('Non-200 response from Twitter API (statuses/oembed.json: ' + response.statusCode);
                }

                if (typeof oembed !== 'object') {
                    return cb('Object expected in Twitter API (statuses/oembed.json), got: ' + oembed);
                }

                oembed.title = oembed.author_name + ' on Twitter';
                oembed["min-width"] = options.getProviderOptions("twitter.min-width");
                oembed["max-width"] = options.getProviderOptions("twitter.max-width");

                var result = {
                    twitter_oembed: oembed
                };

                if (/pic\.twitter\.com/i.test(oembed.html)) {
                    result.__allowTwitterOg = true;
                    options.followHTTPRedirect = true; // avoid core's re-directs. Use HTTP request redirects instead
                    options.exposeStatusCode = true;
                } else {
                    result.twitter_og = {};
                }

                return cb(error, result);
            }
        }, cb);
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

        var html = twitter_oembed.html;

        // Apply config

        var locale = options.getProviderOptions('locale');
        var locale_RE = /^\w{2,3}(?:(?:\_|\-)\w{2,3})?$/i;
        if (locale && locale_RE.test(locale)) {
            if (!/^zh\-/i.test(locale)) {
                locale = locale.replace(/\-.+$/i, '');
            }
            html = html.replace(/<blockquote class="twitter\-tweet"( data\-lang="\w+(?:(?:\_|\-)\w+)?")?/, '<blockquote class="twitter-tweet" data-lang="' + locale + '"');
        }
        
        if (options.getProviderOptions('twitter.center', true) && !/\s?align=\"center\"/.test(html)) {
            html = html.replace('<blockquote class="twitter-tweet"', '<blockquote class="twitter-tweet" align="center"');
        }

        if (options.getProviderOptions('twitter.dnt') && !/\s?data-dnt=/.test(html)) {
            html = html.replace('<blockquote class="twitter-tweet"', '<blockquote class="twitter-tweet" data-dnt="true"');
        }

        var links = [];

        // Handle tweet options
        var has_thread = /\s?data-conversation=\"none\"/.test(html);
        var has_media = !!twitter_og.video
                        || /https:\/\/t\.co\//i.test(html) 
                        || /pic\.twitter\.com\//i.test(html) 
                        || twitter_og.image && (!!twitter_og.image.user_generated || !/\/profile_images\//i.test(twitter_og.image));

        if (has_thread && !options.getRequestOptions('twitter.hide_thread', true)) {
            html = html.replace(/\s?data-conversation=\"none\"/i, '');
        }

        if (has_media && options.getRequestOptions('twitter.hide_media', false) && !/\s?data-cards=\"hidden\"/.test(html)) {
            html = html.replace('<blockquote class="twitter-tweet"', '<blockquote class="twitter-tweet" data-cards="hidden"');
        } else if (!options.getRequestOptions('twitter.hide_media', true) && /\s?data-cards=\"hidden\"/.test(html)) {
            html = html.replace(/\s?data-cards=\"hidden\"/i, '');
        }

        var theme = options.getRequestOptions('players.theme', '');
        if (theme === 'dark' && !/data\-theme=\"dark\"/.test(html)) {
            html = html.replace('<blockquote class="twitter-tweet"', '<blockquote class="twitter-tweet" data-theme="dark"');
        }

        // Declare options
        var opts = {};

        if (has_thread) {
            opts.hide_thread = {
                label: 'Hide previous Tweet in conversation thread',
                value: /\s?data-conversation=\"none\"/.test(html)
            }
        }

        if (has_media) {
            opts.hide_media = {
                label: 'Hide photos, videos, and cards',
                value: /\s?data-cards=\"hidden\"/.test(html)
            }
        }

        opts.theme = {
            value: theme,
            values: {
                dark: "Use dark theme"
            }
        };

        opts.maxwidth = {
            value: '',
            label: CONFIG.L.width,
            placeholder: '220-550, in px'
        };
        
        var maxwidth = parseInt(options.getRequestOptions('maxwidth'));
        if (maxwidth && maxwidth >= 220 && maxwidth <= 550) {
            if (!/data\-width=\"/.test(html)) {
                html = html.replace(
                    '<blockquote class="twitter-tweet"',
                    '<blockquote class="twitter-tweet" data-width="' + maxwidth + '"'
                );
            } else if (/data\-width=\"/.test(html)) {
                html = html.replace(
                    /data-width="\d+"/,
                    'data-width="' + maxwidth + '"'
                );
            }
            opts.maxwidth.value = maxwidth
        }

        var app = {
            html: html,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.inline, CONFIG.R.ssl],
            "max-width": opts.maxwidth.value || twitter_oembed["width"] || 550,
            options: opts
        };

        if ((/https:\/\/t\.co\//i.test(twitter_oembed.html) && !/pic\.twitter\.com\//i.test(twitter_oembed.html)) // there's a link and a card inside the tweet
            || (twitter_og.image && !(twitter_og.image.user_generated || /\/profile_images\//i.test(twitter_og.image)))) { // user_generated is string = 'true' for pics
            app['aspect-ratio'] = 1;
        }

        links.push(app);

        if (twitter_og.image) {
            const isProfilePic = /\/profile_images\//i.test(twitter_og.image.url || twitter_og.image.src || twitter_og.image);

            var thumbnail = {
                href: twitter_og.image.url || twitter_og.image.src || twitter_og.image,
                type: CONFIG.T.image,
                rel: isProfilePic ? [CONFIG.R.thumbnail, CONFIG.R.profile] : CONFIG.R.thumbnail
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
        "https://twitter.com/Tackk/status/610432299486814208/video/1",
        "https://twitter.com/RockoPeppe/status/582323285825736704?lang=en"  // og-image
    ]
};