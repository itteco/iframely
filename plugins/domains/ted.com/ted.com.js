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
        if (iframe && oembed.height) {
            const locale = options.getRequestOptions('ted.locale', false);
            let links = {
                type: CONFIG.T.text_html,
                rel:[CONFIG.R.oembed, CONFIG.R.player, CONFIG.R.html5, CONFIG.R.ssl],
                href: locale ? `${iframe.src}?language=${locale}` : iframe.src,
                "aspect-ratio": oembed.width / oembed.height
            };
            if (tedLangs) {
                links.options = {
                    locale: {
                        label: "Locale",
                            value: locale,
                            values: tedLangs
                    }
                }
            }
            return links
        }

    },

    getData: function(url, meta, options, cb) {
        let langs = {};
        let oembedUrl = meta.canonical.toLowerCase();
        meta.alternate.forEach(function(alternative) {
            if (typeof(alternative) === "string" && /\?/.test(alternative)) {
                /** Expect `alternative` to be like:
                 *  https://www.ted.com/talks/greta_thunberg_the_disarming_case_to_act_right_now_on_climate_change?language=hr
                 */
                const langCode = new URLSearchParams(alternative.split('?')[1]).get('language');
                langs[langCode] = CONFIG.LC[langCode] || langCode;
            }
        });

        let lang = options.getRequestOptions('ted.locale', 'en');
        lang = lang ? lang.toLowerCase() : lang;
        const is_valid_lang = lang && meta.alternate && langs[lang] !== undefined;

        if (is_valid_lang && !/language=/.test(meta.canonical)) {
            /** Add desired language to oembed url */
            oembedUrl = `${meta.canonical.toLowerCase()}?language=${lang}`;
        } else if (!is_valid_lang && /language=/.test(meta.canonical)) {
            /** Make sure we have no wrong language code in oembed request */
            let params = new URLSearchParams(url.split('?')[1]);
            oembedUrl = url.split('?')[0];
            params.delete('language');
            if (params.toString()) {
                oembedUrl += `?${params.toString()}`;
            }
        }

        let src = 'https://www.ted.com/services/v1/oembed.json?url=' + encodeURIComponent(oembedUrl);
        let data = {
            oembedLinks: [{
                href: src,
                rel: 'alternate',
                type: 'application/json+oembed'
            }],
        };
        if (Object.entries(langs).length !== 0) {
            data.tedLangs = langs
        }

        cb (null, data);
    },

    tests: [{
        page: "http://www.ted.com/talks",
        selector: "#browse-results a"
    }, {skipMethods: ['getData']},
        "http://www.ted.com/talks/kent_larson_brilliant_designs_to_fit_more_people_in_every_city",
        "https://www.ted.com/talks/neha_narula_the_future_of_money?language=zh-TW"
    ]
};