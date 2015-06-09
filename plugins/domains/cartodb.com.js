var cheerio = require('cheerio');

module.exports = {

    re: /^https?:(\/\/\w+\.cartodb\.com\/(?:u\/\w+\/)?viz\/[a-z0-9-]+)/i,

    mixins: [
        // "oembed-title", oembed title is null :\\
        // no thumbnail in oembed too
        "twitter-title",
        "twitter-image",
        "oembed-author",
        "oembed-site"
    ],

    getMeta: function(url) {
        return {
            canonical: url.replace(/\/embed_map/, '/public_map')
        };
    },

    getLink: function(oembed) {

        var $container = cheerio('<div>');
        try {
            $container.html(oembed.html5 || oembed.html);
        } catch (ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {

            return {
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5]
                // aspect 4:3 is better than height=520px and width=100%
            };
        }

    },

    tests: [
        "http://team.cartodb.com/u/andrew/viz/9ee7f88c-b530-11e4-8a2b-0e018d66dc29/public_map",
        "https://team.cartodb.com/u/andrew/viz/9ee7f88c-b530-11e4-8a2b-0e018d66dc29/embed_map",
        "https://smb2stfinitesubs1.cartodb.com/viz/39e625ee-cef3-11e4-b8bb-0e0c41326911/public_map"
    ]
};