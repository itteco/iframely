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
        "oembed-title",
        "oembed-video"
    ],

    getData: function(url, meta, options, cb) {

        var src = 'http://www.ted.com/services/v1/oembed.json?url=' + encodeURIComponent(meta.canonical);

        if (!/language=/.test(meta.canonical)) {
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
            }],
            message: 'Add "?language=" into your URL for TED subtitles.' // This is here to prevent fallback to default parsers
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