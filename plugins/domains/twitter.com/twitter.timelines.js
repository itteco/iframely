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

        var limit = options.getRequestOptions('twitter.limit', 
            (/data\-(?:tweet\-)?limit=\"(\d+)\"/i.test(html) && html.match(/data\-(?:tweet\-)?limit=\"(\d+)\"/i)[1])
            || 20);

        if (/data\-(?:tweet\-)?limit=\"(\d+)\"/.test(html)) {
            html = html.replace(/data\-(?:tweet\-)?limit=\"\d+\"/, '');
        }

        if (limit !== 20) {
            html = html.replace(/href="/, 'data-tweet-limit="' + limit + '" href="');
        }            

        return {
            html: html,
            rel: [CONFIG.R.reader, CONFIG.R.html5, CONFIG.R.ssl, CONFIG.R.inline],
            type: CONFIG.T.text_html,
            'max-width': oembed.width,
            options: {
                limit: {
                    label: 'Include up to 20 tweets',
                    value: limit,
                    range: {
                        max: 20,
                        min: 1
                    }
                }
            }
        }
    },

    tests: [
        "https://twitter.com/potus",
        "https://twitter.com/i/moments/737260069209972736",
        "https://twitter.com/TwitterDev/timelines/539487832448843776",
        "https://twitter.com/i/moments/1100515464948649985",
        "https://twitter.com/TwitterDev/lists/national-parks",
        { skipMixins: ["og-image"]}
    ]
};