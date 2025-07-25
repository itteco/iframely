export default {

    // Embedded Like, Collection, and Moment Timelines are now retired.
    // https://twittercommunity.com/t/removing-support-for-embedded-like-collection-and-moment-timelines/150313

    // Embedded user timelines are broken (429) as of May 2025
    // 
    re: [
        /^https?:\/\/(?:twitter|x)\.com\/(\w+)\/lists?\/(\d+)/i,
        /^https?:\/\/(?:twitter|x)\.com\/(\w+)\/?(?:\?.*)?$/i,
    ],

    mixins: [
        'domain-icon',
        'oembed-error',
        'oembed-site'
    ],

    provides: ['__allowTwitterOg'],

    getMeta: function(twitter_og, urlMatch) {
        return {
            title: twitter_og.title || urlMatch[1],
            description: twitter_og.description
        }
    },

    getLink: function(url, oembed, twitter_og, options) {

        var links = [];
        var enable_timeline = options.getRequestOptions('twitter.timeline', false);

        if (oembed.html && enable_timeline) {
            var html = oembed.html;

            var locale = options.getProviderOptions('locale');
            var locale_RE = /^\w{2,3}(?:(?:\_|\-)\w{2,3})?$/i;
            if (locale && locale_RE.test(locale)) {
                if (!/^zh\-/i.test(locale)) {
                    locale = locale.replace(/\-.+$/i, '');
                }
                html = html.replace(/<a class="twitter\-timeline"( data\-lang="\w+(?:(?:\_|\-)\w+)?")?/, '<a class="twitter-timeline" data-lang="' + locale + '"');
            }

            var width = options.getRequestOptions('twitter.maxwidth',
                (/data\-width=\"(\d+)\"/i.test(html) && html.match(/data\-width=\"(\d+)\"/i)[1])
                || '');

            if (/^\d+$/.test(width)) {
                if (/data\-width=\"(\d+)\"/i.test(html)) {
                    html = html.replace(/data\-width=\"(\d+)\"/i, `data-width="${width}"`);
                } else {
                    html = html.replace('<a class="twitter-timeline"', `<a class="twitter-timeline" data-width="${width}"`);
                }
            } else {
                html = html.replace(/data\-width=\"\d+\"\s?/i, '');
                width = ''; // Includes input validation
            }

            // `data-height` works only if there's no `data-limit`.
            var height = options.getRequestOptions('twitter.height',
                (/data\-height=\"(\d+)\"/i.test(html) && html.match(/data\-height=\"(\d+)\"/i)[1])
                || '');

            if (/^\d+$/.test(height)) {
                if (/data\-height=\"(\d+)\"/i.test(html)) {
                    html = html.replace(/data\-height=\"(\d+)\"/i, `data-height="${height}"`);
                } else {
                    html = html.replace('<a class="twitter-timeline"', `<a class="twitter-timeline" data-height="${height}"`);
                }
            } else {
                html = html.replace(/data\-height=\"\d+\"\s?/i, '');
                height = ''; // Includes input validation
            }        

            if (options.getProviderOptions('twitter.center', true) && /data\-width=\"\d+\"/i.test(html)) {
                html = '<div align="center">' + html + '</div>';
            }

            var limit = options.getRequestOptions('twitter.limit', 
                (/data\-(?:tweet\-)?limit=\"(\d+)\"/i.test(html) && html.match(/data\-(?:tweet\-)?limit=\"(\d+)\"/i)[1])
                || 20);

            if (/data\-(?:tweet\-)?limit=\"(\d+)\"/.test(html)) {
                html = html.replace(/data\-(?:tweet\-)?limit=\"\d+\"/, '');
            }

            if (height) {
                limit = 20; // `data-height` works only if there's no `data-limit`. Let's give it priority.
            }

            if (limit !== 20) {
                html = html.replace(/href="/, 'data-tweet-limit="' + limit + '" href="');
            }

            var theme = options.getRequestOptions('players.theme', '');
            if (theme === 'dark' && !/data\-theme=\"dark\"/.test(html)) {
                html = html.replace(/href="/, 'data-theme="dark" href="');
            }

            links.push({
                html: html,
                rel: [CONFIG.R.reader, CONFIG.R.ssl, CONFIG.R.inline],
                type: CONFIG.T.text_html,
                options: {
                    timeline: {
                        label: 'Embed as timeline',
                        value: true
                    },
                    limit: {
                        label: 'Include up to 20 tweets',
                        value: limit,
                        range: {
                            max: 20,
                            min: 1
                        }
                    },
                    theme: {
                        value: theme,
                        values: {
                            dark: "Use dark theme"
                        }
                    },
                    maxwidth: {
                        value: width || '',
                        label: CONFIG.L.width,
                        placeholder: 'e.g. 550, in px'
                    },
                    height: {
                        label: CONFIG.L.height,
                        value: height,
                        placeholder: 'in px. Overrides # of tweets.'
                    }
                }
            })
        }

        if (twitter_og.image) {
            var thumbnail = {
                href: twitter_og.image.url || twitter_og.image.src || twitter_og.image,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
            };
            if (!enable_timeline) {
                thumbnail.options = {
                    timeline: {
                        label: 'Embed as timeline',
                        value: false
                    }
                }
            }
            links.push(thumbnail);
        }

        return links;
    },

    getData: function(options) {
        options.followHTTPRedirect = true; // avoids login re-directs on /likes that blocked oEmbed discovery
        options.exposeStatusCode = true;
        return {
            __allowTwitterOg: true
        }
    },

    tests: [
        "https://twitter.com/potus",
        "https://twitter.com/XDevelopers",
        "https://twitter.com/i/lists/211796334",
        {skipMixins: ["domain-icon", "oembed-error"]}, {skipMethods: ["getData"]}
    ]
};