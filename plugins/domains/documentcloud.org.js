module.exports = {

    re: /^https?:\/\/(?:www\.)?documentcloud\.org\/documents?\/\d+/i,

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

        if (oembed.type === 'rich') { // else: fallback to generic
            var html = oembed.html;
            var aspect = /padding\-bottom:(\d+.\d+)%/.test(html) && parseFloat(html.match(/padding\-bottom:(\d+.\d+)%/)[1]);
            
            var link = {
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.html5, CONFIG.R.ssl, CONFIG.R.inline],
                'aspect-ratio': aspect ? 100 / aspect : 1 / Math.sqrt(2) // document aspect
            }            

            if (/DC\-embed\-document/.test(html)) {
                var page = options.getRequestOptions('documentcloud.page', '1');
                try {
                    if (page && page !== '1') {
                        html = html.replace ('" title="', '#document/p' + page + '" title="');                    
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
        if (/\.html#document\/p(\d+)(?:\/a(\d+))?/i.test(url)) {
            var m = url.match(/\.html#document\/p(\d+)(?:\/a(\d+))?/i);
            var redirect = url.replace(/\.html#document\/p(\d+)(?:\/a(\d+))?/i, '');
            if (m[2]) {
                redirect += '/annotations/' + m[2] + '.html';
            } else {
                redirect += '/pages/' + m[1] + '.html';
            }
            cb ({redirect: redirect});
        } else {
            cb (null);
        }
    },

    tests: [{skipMethods: ['getData']},
        'https://www.documentcloud.org/documents/73991-day-three-documents',
        'https://www.documentcloud.org/documents/5766398-ASRS-Reports-for-737-max8.html#document/p2/a486265',
        'https://www.documentcloud.org/documents/5766398-ASRS-Reports-for-737-max8/annotations/486265.html',
        'https://www.documentcloud.org/documents/5766398-ASRS-Reports-for-737-max8/pages/2.html',
        {
            noFeeds: true
        }
    ]
};