import * as URL from 'url';

export default {

    re: /^https?:\/\/(?:www\.)?ted\.com\/(?:talks|dubbing)\//i,

    provides: [
        "oembedLinks",
        "tedLangs",
        "__allowEmbedURL"
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
        "embedurl",
        'embedurl-meta'
    ],

    getLink: function(oembed, tedLangs) {
        const iframe = oembed.getIframe();

        if (iframe && oembed.height) {

            let src = iframe.src;
            let lang_slug = src 
                            && tedLangs.language && tedLangs.language.value 
                            && tedLangs.language.value !== '-' // clearing language from within URL itself via `&_language=-` option
                                ? `/lang/${tedLangs.language.value}`
                                : '';

            if (lang_slug && src.indexOf(lang_slug) === -1) {
                src = src.replace(/\/talks\//, `/talks${lang_slug}/`);
            } else if (lang_slug === '') {
                src = src.replace(/\/lang\/\w{2}/, '');
            }

            let link = {
                href: src,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.oembed],
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
                if (typeof(alternative) === "string" && /\?language=([a-z\-]+)$/i.test(alternative)) {
                    const lang = alternative.match(/\?language=([a-z\-]+)$/i)[1];
                    
                    availableLanguages[lang] = CONFIG.LC && CONFIG.LC[lang] || lang;

                    if (lang === 'en') {
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

        // https://blog.ted.com/announcing-ai-adapted-multilingual-ted-talks/
        // /dubbing/ URIs return 404 in TED's oEmbed as of May 24, 2024
        const uri = (meta.canonical || url).replace(/\/dubbing\//i, "/talks/"); 

        let data = {
            oembedLinks: [{
                href: 'https://www.ted.com/services/v1/oembed.json?url=' 
                    + encodeURIComponent(uri)
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

        } else if (Object.keys(availableLanguages).length === 0) {
            // For Pop Francis, the oEmbed request will fail without &language=es.
            // And there' no way to detect &es language/
            // So let's fallback to microformats (luckily, they have one on the page).
            data.__allowEmbedURL = true;
        }

        // Unfortunately as of Apr 11, 2022, we need to verify if it's YouTube for every URL.
        // Before we could check empty languages or absense of oEmbed discovery link. 
        // Now all valid and invalid players have identical data sets.
        data.__isYouTube = 'maybe';

        /** `cb` is needed to be one tick ahead of oembedLinks auto-discovery. */
        return cb (null, data);
    },

    tests: [{
        pageWithFeed: "https://www.ted.com"
    },
        {skipMethods: ['getData']}, {skipMixins: ['embedurl', 'og-title']},
        "https://www.ted.com/talks/kent_larson_brilliant_designs_to_fit_more_people_in_every_city",
        "https://www.ted.com/talks/neha_narula_the_future_of_money?language=zh-TW",
        "https://www.ted.com/talks/lucy_cooke_3_bizarre_and_delightful_ancient_theories_about_bird_migration",
        "https://www.ted.com/talks/lera_boroditsky_how_language_shapes_the_way_we_think",
        "https://www.ted.com/talks/madhumita_murgia_comment_le_stress_affecte_votre_cerveau?language=fr", // test with &&_language=-
        "https://www.ted.com/dubbing/lera_boroditsky_how_language_shapes_the_way_we_think?language=en&audio=en",        

        // Should work, but let's skip from tests not to avoid all oembed-* mixins
        // "https://www.ted.com/talks/su_santidad_el_papa_francisco_nuestro_imperativo_moral_para_actuar_sobre_el_cambio_climatico_y_3_pasos_que_podemos_dar",
    ]
};