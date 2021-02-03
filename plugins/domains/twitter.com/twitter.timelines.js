module.exports = {

    re: [
        /^https?:\/\/twitter\.com\/(\w+)\/(?:timelines?|moments?|likes?)\/(\d+)/i,
        /^https?:\/\/twitter\.com\/(\w+)\/?(?:\?.*)?$/i,
        /^https?:\/\/twitter\.com\/(\w+)\/(?:timelines?|moments?|likes?|lists?)\/?/i
    ],

    mixins: [
        'domain-icon',
        'oembed-error',
    ],

    getMeta: function(meta, urlMatch) {
        return {
            title: meta['html-title'] || urlMatch[1],
            description: meta.description
        }
    },

    getLink: function(url, oembed, options) {

        var html = oembed.html;

        var width = options.maxWidth || options.getProviderOptions('twitter.timeline_width');

        if (width) {
            html = html.replace(/data\-width=\"(\d+)\"/i, `data-width="${width}"`);
        } else if (width === '') {
            html = html.replace(/data\-width=\"\d+\"\s?/i, '');
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

        if (limit !== 20) {
            html = html.replace(/href="/, 'data-tweet-limit="' + limit + '" href="');
        }

        var theme = options.getRequestOptions('players.theme', '');
        if (theme === 'dark' && !/data\-theme=\"dark\"/.test(html)) {
            html = html.replace(/href="/, 'data-theme="dark" href="');
        }

        return {
            html: html,
            rel: [CONFIG.R.reader, CONFIG.R.html5, CONFIG.R.ssl, CONFIG.R.inline],
            type: CONFIG.T.text_html,
            options: {
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
                }
            }
        }
    },

    getData: function(options) {
        options.followHTTPRedirect = true; // avoids login re-directs on /likes that blocked oEmbed discovery
        options.exposeStatusCode = true;
    },

    tests: [
        "https://twitter.com/potus",
        "https://twitter.com/potus/likes",
        "https://twitter.com/i/moments/737260069209972736",
        "https://twitter.com/TwitterDev/timelines/539487832448843776",
        "https://twitter.com/i/moments/1100515464948649985",
        "https://twitter.com/TwitterDev/lists/national-parks",
        {skipMixins: ["domain-icon", "oembed-error"]}, {skipMethods: ["getData"]}
    ]
};