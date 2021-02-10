const URL = require('url');

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
        "og-description",
        "keywords",
        "oembed-site",
        "og-title",
    ],

    getLink: function(oembed, tedLangs) {
        const iframe = oembed.getIframe();

        if (iframe && oembed.height) {

            let src = iframe.src;
            let lang_slug = src && tedLangs.language && tedLangs.language.value && `/lang/${tedLangs.language.value}`;
            if (lang_slug && src.indexOf(lang_slug) === -1) {
                src = src.replace(/\/talks\//, `/talks${lang_slug}/`);
            }

            let link = {
                href: src,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.oembed],
                "aspect-ratio": oembed.width / oembed.height
            };

            if (tedLangs.language) {
                link.options = tedLangs;
            }

            return link;
        }

    },

    getData: function(url, meta, options, cb) {
        let availableLanguages = {};
        let isTranslatedToEnglish = false;

        /**
         * Fill available languages from `<link rel="alternate" href="...?language=...",
         * But skip English as it doesn't turn subtitles on.
         */
        if (meta.alternate) {
            meta.alternate.forEach(function(alternative) {
                if (typeof(alternative) === "string" && /\?/.test(alternative)) {
                    const query = URL.parse(alternative.toLowerCase(), true).query;                    
                    
                    availableLanguages[query.language] = CONFIG.LC && CONFIG.LC[query.language] || query.language;

                    if (query.language === 'en') {
                        isTranslatedToEnglish = true;
                    }
                }
            });
        }

        const query = URL.parse(url.toLowerCase(), true).query;

        let language = options.getRequestOptions(
                        'ted.language', 
                        query.language 
                            || options.getProviderOptions('locale') && options.getProviderOptions('locale').replace(/(\_|\-)\w+$/i, '')
                        ) || '';

        if (!availableLanguages[language]) {
            /** oEmbed request fails with 404 if language isn't valid... */
            language = '';
            meta.canonical = (meta.canonical || url).replace(/\??language=[\w_\-]+/, '');
        }

        let oembedLang = language;
        /** When English isn't supported, oEmbed failes without proper language */
        if (oembedLang === '' && !isTranslatedToEnglish && Object.keys(availableLanguages).length === 1) {
            oembedLang = Object.keys(availableLanguages)[0];
        }

        let data = {
            oembedLinks: [{
                href: 'https://www.ted.com/services/v1/oembed.json?url=' 
                    + encodeURIComponent(meta.canonical || url)
                    + (oembedLang !== '' ? '&language=' + oembedLang : ''),
                rel: 'alternate',
                type: 'application/json+oembed'
            }],
            tedLangs: {}
        };

        if (Object.keys(availableLanguages).length > 0) {
            /**
             * Options form must be able to drop URL's language.
             * The only way to do so is with any non-empty special value.
             * It won't pass language validation and will be dropped to ''.
             */
            if (/* url. */ query.language) {
                availableLanguages['-'] = '';
                if (language === '') {
                    language = '-';
                }
            } else if (Object.keys(availableLanguages).length > 1) {
                availableLanguages[''] = '';
            } else {
                /** 
                 * For a single language, leave it alone and don't add an empty value
                 * so the options form transforms into a checkbox. 
                 * https://iframely.com/docs/options#an-exception-to-options-mapping
                 */
            }
            
            data.tedLangs = {
                language: {
                    label: "Subtitles",
                    value: language,
                    values: availableLanguages
                }
            }

            if (meta && meta.alternate 
                && !meta.alternate.some(
                    (link) => /^(application|text)\/(xml|json)\+oembed$/i.test(link.type)
                )) {
                data.__isYouTube = true;
            }            
        }
        /** `cb` is needed to be one tick ahead of oembedLinks auto-discovery. */
        return cb (null, data);
    },

    tests: [{
        page: "https://www.ted.com/talks",
        selector: "#browse-results a"
    }, {skipMethods: ['getData']},
        "https://www.ted.com/talks/kent_larson_brilliant_designs_to_fit_more_people_in_every_city",
        "https://www.ted.com/talks/neha_narula_the_future_of_money?language=zh-TW",
        "https://www.ted.com/talks/lucy_cooke_3_bizarre_and_delightful_ancient_theories_about_bird_migration",

        // Not translated to English:
        "https://www.ted.com/talks/madhumita_murgia_comment_le_stress_affecte_votre_cerveau",
        "https://www.ted.com/talks/su_santidad_el_papa_francisco_nuestro_imperativo_moral_para_actuar_sobre_el_cambio_climatico_y_3_pasos_que_podemos_dar",
    ]
};