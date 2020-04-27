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

    getLink: function(oembed, tedLangs) {
        const iframe = oembed.getIframe();

        if (iframe && oembed.height) {
            const src = tedLangs.locale && tedLangs.locale.value && tedLangs.locale.value !== ''
                        ? `${iframe.src}?language=${tedLangs.locale.value}`
                        : iframe.src;
            let links = {
                type: CONFIG.T.text_html,
                rel:[CONFIG.R.oembed, CONFIG.R.player, CONFIG.R.html5, CONFIG.R.ssl],
                href: src,
                "aspect-ratio": oembed.width / oembed.height
            };

            if (Object.keys(tedLangs)) {
                links.options = tedLangs
            }
            return links
        }

    },

    getData: function(url, meta, options, cb) {
        let langs = {};
        const noLocale = '-';
        let oembedUrl = meta.canonical.toLowerCase();
        let optsLocale = options.getRequestOptions('ted.locale', noLocale);
        let urlLocale = new URLSearchParams(url.split('?')[1]).get('language');
        urlLocale = urlLocale ? urlLocale.toLowerCase() : urlLocale;
        const configLocale = options.getProviderOptions('locale').replace(/(\_|\-)\w+$/i, '');
        if (configLocale && !urlLocale) {
            urlLocale = configLocale
        }
        if (!urlLocale) urlLocale = '';

        meta.alternate.forEach(function(alternative) {
            if (typeof(alternative) === "string" && /\?/.test(alternative)) {
                /** Expect `alternative` to be like:
                 *  https://www.ted.com/talks/greta_thunberg_the_disarming_case_to_act_right_now_on_climate_change?language=hr
                 */
                const langCode = new URLSearchParams(alternative.split('?')[1]).get('language');
                langs[langCode] = CONFIG.LC[langCode] || langCode;
            }
        });

        const is_valid_lang = urlLocale && langs[urlLocale] !== undefined;

        if (/language=/.test(meta.canonical)) {
            /** Make sure we have no wrong language code in oembed request */
            let params = new URLSearchParams(url.split('?')[1]);
            oembedUrl = url.split('?')[0];
            params.delete('language');
            if (params.toString()) {
                oembedUrl += `?${params.toString()}`;
            }
        }
        if (is_valid_lang && optsLocale !== noLocale) {
            /** Add desired language to oembed url */
            oembedUrl = `${meta.canonical.toLowerCase()}?language=${optsLocale}`;
        }

        if (optsLocale === noLocale) optsLocale = '';

        let data = {
            oembedLinks: [{
                href: 'https://www.ted.com/services/v1/oembed.json?url=' + encodeURIComponent(oembedUrl),
                rel: 'alternate',
                type: 'application/json+oembed'
            }]
        };

        if (langs) {
            langs[noLocale] = 'No transcript';
            data.tedLangs = {
                locale: {
                    label: "Transcript",
                        value: optsLocale || urlLocale,
                        values: langs
                }
            }
        } else {
            data.tedLangs = {};
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