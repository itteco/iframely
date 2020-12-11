module.exports = {

    re: /^https?:\/\/(?:www|beta)?\.?documentcloud\.org\/documents?\/\d+/i,

    mixins: [
        "domain-icon",
        "oembed-site",
        "canonical",
        "author",
        "og-title",
        "og-image",
        "og-description"
    ],

    // plugin is required to add aspect-ratio and with this fix embeds when used inside iFrame
    // https://www.documentcloud.org/help/api#oembed

    getLink: function(oembed, options) {

        if (oembed.type === 'rich' && oembed.html) { // else: fallback to generic
            var html = oembed.html.replace(/\r?\n|\r/g, '');
            var aspect = /padding\-bottom:(\d+.\d+)%/.test(html) && parseFloat(html.match(/padding\-bottom:(\d+.\d+)%/)[1]);
            
            var link = {
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.html5, CONFIG.R.ssl, CONFIG.R.inline],
                'aspect-ratio': aspect ? 100 / aspect : 1 / Math.sqrt(2) // document aspect
            };

            if (!/DC\-note/.test(html) && !/DC\-embed\-page/.test(html)) {
                var page = options.getRequestOptions('documentcloud.page', '1');

                try {
                    if (page && page !== '1') {
                        html = html.replace (/"\s+title="/i, '#document/p' + page + '" title="');
                    }

                    link.options = {
                        page: {
                            label: CONFIG.L.page,
                            value: parseInt (page)
                        }
                    }
                } catch (ex) {}

            }

            link.html = html;
            return link;
        }
    },

    getData: function(url, cb) {

        const isBeta = /beta\.documentcloud\.org/.test(url);

        if (!isBeta && /(?:\.html)?#document\/p(\d+)(?:\/a(\d+))?/i.test(url)) {
            var m = url.match(/(?:\.html)?#document\/p(\d+)(?:\/a(\d+))?/i);
            var redirect = url.replace(/(?:\.html)?#document\/p(\d+)(?:\/a(\d+))?/i, '');
            
            if (m[2]) {
                redirect += '/annotations/' + m[2] + '.html';
            } else {
                redirect += '/pages/' + m[1] + '.html';
            }
            
            return cb ({
                redirect: redirect
            });

        } else if (!isBeta && (
                url.indexOf('%') !== -1 
                || !/\d+\-[a-zA-Z0-9\-]+(?:(\.|\/|\?).+)?$/.test(url)
            )
        ) {
            /** Fix for unicode characters in url causes 400 at provider oEmbed api */
            var uri = encodeURI(url.replace(/(\d+\-)[^./#?]+/i, '$1-').replace(/(\/\d+--)[^.]*$/i, '$1.html'));
            
            return cb(null, {
                oembedLinks: ['json', 'xml'].map(function (format) {
                    return {
                        href: `https://www.documentcloud.org/api/oembed.${format}?url=${uri}`,
                        rel: 'alternate',
                        type: `application/${format}+oembed`
                    }
                })
            });

        } else {
            cb (null);
        }
    },

    tests: [{skipMethods: ['getData']}, {skipMixins: ['og-description', 'author']},
        'https://www.documentcloud.org/documents/73991-day-three-documents',
        'https://www.documentcloud.org/documents/5766398-ASRS-Reports-for-737-max8.html#document/p2/a486265',
        'https://www.documentcloud.org/documents/5766398-ASRS-Reports-for-737-max8/annotations/486265.html',
        'https://www.documentcloud.org/documents/5766398-ASRS-Reports-for-737-max8/pages/2.html',
        'https://www.documentcloud.org/documents/7203159-Joaqu%C3%ADn-El-Chapo-Guzm%C3%A1n-Appeal.html',
        'https://www.documentcloud.org/documents/7203159-Joaqu%C3%ADn-El-Chapo-Guzm%C3%A1n-Appeal',
        'https://www.documentcloud.org/documents/7203159-Joaqu%C3%ADn-El-Chapo-Guzm%C3%A1n-Appeal/pages/2.html',
        "https://beta.documentcloud.org/documents/20059068-the-mueller-report#document/p17/a2001254",
        "https://beta.documentcloud.org/documents/20059068-the-mueller-report",
        {
            noFeeds: true
        }
    ]
};