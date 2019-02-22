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

        var vary;

        // data-tweet-limit works only for users as of 2019/01/24
        if (!/\/(timeline|moment|like|list)/.test(url)) {

            var more = options.getProviderOptions(CONFIG.O.more, false);
            var less = options.getProviderOptions(CONFIG.O.less, false);

            if (/data\-(?:tweet\-)?limit=\"(\d+)\"/.test(html) && (more || less)) {
                html = html.replace(/data\-(?:tweet\-)?limit=\"\d+\"/, '');                
            }

            if (less) {
                html = html.replace(/href="/, 'data-tweet-limit="1" href="');
            }            

            vary = {
                'iframely.more': 'Include up to 20 tweets',
                'iframely.less': 'Include just the latest tweet'
            };

            if (more) {
                delete vary['iframely.less'];
            } else if (less || !/data\-(?:tweet\-)?limit=\"(\d+)\"/.test(oembed.html)) {
                delete vary['iframely.more'];
            }

        }

        var result = {
            html: html,
            rel: [CONFIG.R.reader, CONFIG.R.html5, CONFIG.R.ssl, CONFIG.R.inline],
            type: CONFIG.T.text_html,
            'max-width': oembed.width
        }

        if (vary) {
            // result.options = vary;
        }

        return result;
    },

    tests: [
        "https://twitter.com/potus",
        "https://twitter.com/i/moments/737260069209972736",
        "https://twitter.com/TwitterDev/timelines/539487832448843776",
        "https://twitter.com/TwitterDev/lists/national-parks",
        { skipMixins: ["og-image"]}
    ]
};