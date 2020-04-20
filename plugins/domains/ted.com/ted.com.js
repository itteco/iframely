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

    getLink: function(oembed, url) {
        var $iframe = oembed.getIframe();

        if ($iframe) {
            var query = URL.parse(url,true).query;
            var lang = query.language || query.nolanguage;
            var src = $iframe.src;
            if (!/\/lang\//i.test($iframe.src) && lang) {
                src = $iframe.src.replace(/\/talks\//i, '/talks/lang/' + lang.toLowerCase() + '\/')
            }

            return {
                type: CONFIG.T.text_html, 
                rel:[CONFIG.R.oembed, CONFIG.R.player, CONFIG.R.html5, CONFIG.R.ssl],
                href: src,
                "aspect-ratio": oembed.width / oembed.height
            }
        }
    },

    getData: function(url, meta, options, cb) {

        var src = 'http://www.ted.com/services/v1/oembed.json?url=' + encodeURIComponent(meta.canonical);

        if (!/languge=/.test(meta.canonical)) {
            var query = URL.parse(url,true).query;
            var lang = (options.getProviderOptions('locale') && options.getProviderOptions('locale').replace(/(\_|\-)\w+$/i, '')) || query.language;
            lang = lang ? lang.toLowerCase() : lang;
            var is_valid_lang = lang && meta.alternate && meta.alternate instanceof Array && meta.alternate.some(function(link) {
                return typeof link.indexOf === 'function' && link.indexOf('language='+lang > -1);
            });
            src += (is_valid_lang ? '&language=' + lang : '');
        }

        cb (null, {oembedLinks: [{
                href: src,
                rel: 'alternate',
                type: 'application/json+oembed'
            }]
        });
    },

    tests: [{
        page: "http://www.ted.com/talks",
        selector: "#browse-results a"
    }, {skipMethods: ['getData']},
        "http://www.ted.com/talks/kent_larson_brilliant_designs_to_fit_more_people_in_every_city",
        "https://www.ted.com/talks/neha_narula_the_future_of_money?language=zh-TW"
    ]
};