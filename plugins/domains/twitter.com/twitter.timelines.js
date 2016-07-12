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

    getLink: function(oembed, options) {

        var html = oembed.html;

        if (options.getProviderOptions('twitter.center', true) && oembed.width) {
            html = '<div align="center">' + html + '</div>';
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