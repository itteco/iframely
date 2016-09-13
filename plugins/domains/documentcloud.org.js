module.exports = {

    re: /^https?:\/\/(?:www\.)?documentcloud\.org\/documents?\/\d+/i,

    mixins: [
        "domain-icon",
        "oembed-site",
        "html-title"
    ],

    // plugin is required to add aspect-ratio and with this fix embeds when used inside iFrame

    getLink: function(oembed) {

        if (oembed.type === 'rich') { // else: fallback to generic
            return {
                html: oembed.html,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.html5, CONFIG.R.ssl, CONFIG.R.inline],
                'aspect-ratio': 1 / Math.sqrt(2) // document aspect
            }
        }
    },

    tests: [
        'https://www.documentcloud.org/documents/73991-day-three-documents',
        {
            noFeeds: true
        }
    ]
};