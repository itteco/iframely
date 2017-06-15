module.exports = {

    // remove this plugin when Twitter fixes centering

    re: [
        /^https?:\/\/twitter\.com\/\w+\/(?:timelines?|moments?|likes?)\/(\d+)/i,
        /^https?:\/\/twitter\.com\/\w+$/i,
        /^https?:\/\/twitter\.com\/\w+\/(?:timelines?|moments?|likes?|lists?)\//i,
    ],

    mixins: [
        'domain-icon',
        'oembed-site',
        'html-title',
        'description',
        'og-image',
        'canonical'
    ],

    getLink: function(url, oembed, options) {

        var html = oembed.html;

        if (options.getProviderOptions('twitter.center', true) && oembed.width) {
            html = '<div align="center">' + html + '</div>';
        }

        if (!/like/.test(url) && (options.getProviderOptions(CONFIG.O.full, false) || options.getProviderOptions(CONFIG.O.compact, false))) {

            var limit = 20;

            if (/data\-(?:tweet\-)?limit=\"(\d+)\"/.test(html)) {
                limit = parseInt(html.match(/data\-(?:tweet\-)?limit=\"(\d+)\"/)[1]);
                html = html.replace(/data\-(?:tweet\-)?limit=\"\d+\"/, '');
            }

            if (options.getProviderOptions(CONFIG.O.full, false)) {
                limit = Math.min(20, limit * 2);
            } else if (options.getProviderOptions(CONFIG.O.compact, false)) {
                limit = Math.max(url.indexOf('moment') > -1 ? 4: 1, parseInt (limit / 2)); 
            }

            html = html.replace(/href="/, 'data-' 
                + (url.indexOf('moment') > -1 ? '' : 'tweet-')
                + 'limit="' + limit + '" href="');
        }

        return {
            html: html,
            rel: [CONFIG.R.reader, CONFIG.R.html5, CONFIG.R.ssl, CONFIG.R.inline],
            type: CONFIG.T.text_html,
            'max-width': oembed.width
        }
    },

    tests: [
        "https://twitter.com/potus",
        "https://twitter.com/i/moments/737260069209972736",
        "https://twitter.com/TwitterDev/timelines/539487832448843776",
        "https://twitter.com/TwitterDev/lists/national-parks",
        { skipMixins: ["og-image"]}
    ]
};