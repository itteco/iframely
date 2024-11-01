export default {

    re: /^https?:\/\/(?:www)?\.?documentcloud\.org\/documents?\/\d+/i,

    mixins: [
        "domain-icon",
        "oembed-site",
        "canonical",
        "author",
        "og-image",
        "og-description"
    ],

    // plugin is required to add aspect-ratio and with this fix embeds when used inside iFrame
    // https://www.documentcloud.org/help/api#oembed

    getMeta: function(oembed, options) {
        var title = options.getRequestOptions('documentcloud.title');
        if (title && oembed.title) {
            return {
                title: oembed.title
            }
        }
    },

    getLink: function(url, oembed, options) {

        if (oembed.type === 'rich' && oembed.html) { // else: fallback to generic
            var html = oembed.html.replace(/\r?\n|\r/g, '');
            var aspect = /padding\-bottom:(\d+.\d+)%/.test(html) && 100 / parseFloat(html.match(/padding\-bottom:(\d+.\d+)%/)[1])
                        || oembed.width && oembed.height && oembed.width / oembed.height
                        || CONFIG.DOC_ASPECT_RATIO;
            
            var link = {
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.ssl],
                'aspect-ratio': aspect
            };

            if (!/DC\-note/.test(html) && !/DC\-embed(?:\-page)?/.test(html)) {
                var page = options.getRequestOptions('documentcloud.page', '1');
                var title = !!options.getRequestOptions('documentcloud.title', true);

                try {
                    var iframe = oembed.getIframe();
                    var href = iframe.src;

                    if (page && page !== '1') {
                        if (href) {
                            href += '#document/p' + page;
                        } else {                        
                            html = html.replace (/"\s+title="/i, '#document/p' + page + '" title="');
                        }
                    }

                    link.href = href;
                    link['padding-bottom'] = 80;

                    link.options = {
                        page: {
                            label: CONFIG.L.page,
                            value: parseInt (page)
                        },
                        title: {
                            label: 'Show Title',
                            value: title
                        }
                    }
                } catch (ex) {}
            }

            if (!link.href) {
                link.html = html;
            }

            if (!/DC\-note/.test(html)) {
                link.rel.push(CONFIG.R.inline);
            }

            return link;
        }
    },

    // Pages and comments are covered by known providers in providers.json
    getData: function(url, __noOembedLinks, cb) {
            
        /** Fix for unicode characters in url causes 400 at provider oEmbed api */
        var uri = encodeURI(
            url.indexOf('%') === -1
                ? url
                : url.replace(/(\d+\-)[^./#?]+/i, '$1-')
        );
        
        return cb(null, {
            oembedLinks: ['json', 'xml'].map(function (format) {
                return {
                    href: `https://api.www.documentcloud.org/api/oembed.${format}?url=${encodeURIComponent(uri)}`,
                    rel: 'alternate',
                    type: `application/${format}+oembed`
                }
            })
        });
    },

    tests: [{skipMethods: ['getData']},
        {skipMixins: [
            'og-description',
            'author',
            'canonical',
            'og-image'
        ]},
        'https://www.documentcloud.org/documents/73991-day-three-documents',
        'https://www.documentcloud.org/documents/5766398-ASRS-Reports-for-737-max8.html#document/p2/a486265',
        // 'https://www.documentcloud.org/documents/5766398-ASRS-Reports-for-737-max8/annotations/486265.html',
        // 'https://www.documentcloud.org/documents/5766398-ASRS-Reports-for-737-max8/pages/2.html',
        'https://www.documentcloud.org/documents/7203159-Joaqu%C3%ADn-El-Chapo-Guzm%C3%A1n-Appeal.html',
        'https://www.documentcloud.org/documents/7203159-Joaqu%C3%ADn-El-Chapo-Guzm%C3%A1n-Appeal',
        // 'https://www.documentcloud.org/documents/7203159-Joaqu%C3%ADn-El-Chapo-Guzm%C3%A1n-Appeal/pages/2.html',
        "https://www.documentcloud.org/documents/20059068-the-mueller-report#document/p17/a2001254",
        "https://www.documentcloud.org/documents/20059068-the-mueller-report",
        {
            noFeeds: true
        }
    ]
};