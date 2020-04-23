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
    ],

    getLink: function(oembed, meta, options) {
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
        const locale = options.getRequestOptions('ted.locale', 'en');
        const iframe = oembed.getIframe();
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
                        values: langs
                    }
                },
            }
        }

    },

    getData: function(url, meta, options, cb) {
        var src = 'http://www.ted.com/services/v1/oembed.json?url=' + encodeURIComponent(meta.canonical.toLowerCase());
        cb (null, {oembedLinks: [{
                href: src,
                rel: 'alternate',
                type: 'application/json+oembed'
            }],
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