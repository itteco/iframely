const URL = require("url");

module.exports = {

    re: /^https?:\/\/(?:www\.)?ted\.com\/talks\//i,

    provides: [
        "oembedLinks",
        "tedLangs"
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
    ],

    getLink: function(oembed, tedLangs, options) {
        const iframe = oembed.getIframe();
        const locale = options.getRequestOptions('ted.locale', 'en');
        if (iframe && oembed.height) {
            return {
                type: CONFIG.T.text_html,
                rel:[CONFIG.R.oembed, CONFIG.R.player, CONFIG.R.html5, CONFIG.R.ssl],
                href: `${iframe.src}?language=${locale}`,
                "aspect-ratio": oembed.width / oembed.height,
                options: {
                    locale: {
                        label: "Locale",
                        value: locale,
                        values: tedLangs
                    }
                },
            }
        }

    },

    getData: function(url, meta, options, cb) {
        let languageLabels = options.getProviderOptions('languageLabels', {});
        let langs = {};
        meta.alternate.forEach(function(alternative) {
            if (typeof(alternative) === "string" && /\?/.test(alternative)) {
                /** Expect `alternative` to be like:
                 *  https://www.ted.com/talks/greta_thunberg_the_disarming_case_to_act_right_now_on_climate_change?language=hr
                 */
                const langCode = new URLSearchParams(alternative.split('?')[1]).get('language');
                langs[langCode] = languageLabels[langCode] || langCode;
            }
        });
        var query = URL.parse(url, true).query;
        var lang = query.language || options.getRequestOptions('ted.locale');
        lang = lang ? lang.toLowerCase() : lang;
        var is_valid_lang = lang && meta.alternate && meta.alternate instanceof Array && meta.alternate.some(function (link) {
            return typeof link.indexOf === 'function' && link.indexOf('language=' + lang > -1);
        });

        let oembedUrl = is_valid_lang ? `${meta.canonical.toLowerCase()}?language=${lang}` : meta.canonical.toLowerCase();
        let src = 'http://www.ted.com/services/v1/oembed.json?url=' + encodeURIComponent(oembedUrl);
        src += (is_valid_lang ? '&language=' + lang : '');

        cb (null, {oembedLinks: [{
                href: src,
                rel: 'alternate',
                type: 'application/json+oembed'
            }],
            tedLangs: langs
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