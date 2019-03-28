const cheerio = require('cheerio');
const URL = require("url");

module.exports = {

    re: /^https?:\/\/(?:www\.)?ted\.com\/talks\//i,

    provides: [
        "oembedLinks"
    ],    

    mixins: [
        "og-image",
        "oembed-thumbnail",
        "favicon",
        "oembed-author",
        "oembed-canonical",
        "oembed-description",
        "keywords",
        "oembed-site",
        "oembed-title"
    ],

    getLink: function(oembed, url, options) {

        var $container = cheerio('<div>');
        try {
            $container.html(oembed.html);
        } catch (ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {

            var query = URL.parse(url,true).query;
            var lang = query.language || query.nolanguage;

            return {
                type: CONFIG.T.text_html, 
                rel:[CONFIG.R.oembed, CONFIG.R.player, CONFIG.R.html5, CONFIG.R.ssl],
                href: lang ? $iframe.attr('src').replace(/\/lang\/\w+\//i, '/').replace(/\/talks\//i, '/talks/lang/' + lang.toLowerCase() + '\/') : $iframe.attr('src'),
                "aspect-ratio": oembed.width / oembed.height
            }
        }
    },

    getData: function(url, meta, options, cb) {

        var query = URL.parse(url,true).query;
        var lang = (options.getProviderOptions('locale') && options.getProviderOptions('locale').replace(/(\_|\-)\w+$/i, '')) || query.language;

        var is_valid_lang = lang && meta.alternate && meta.alternate instanceof Array && meta.alternate.some(function(link) {
                return typeof link.indexOf === 'function' && link.indexOf('language='+lang) > -1;
            });

        cb (null, {oembedLinks: [{
                href: 'http://www.ted.com/services/v1/oembed.json?url=' + encodeURIComponent(meta.canonical) + (is_valid_lang ? '&language=' + lang : ''),
                rel: 'alternate',
                type: 'application/json+oembed'
            }]
        });
    },

    tests: [{
        page: "http://www.ted.com/talks",
        selector: "#browse-results a"
    }, {skipMethods: ['getData']},
        "http://www.ted.com/talks/kent_larson_brilliant_designs_to_fit_more_people_in_every_city"
    ]
};