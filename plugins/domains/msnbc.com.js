module.exports = {

    mixins: [
        "*"
    ],

    provides: '__allowEmbedURL',

    getData: function(twitter, whitelistRecord) {

        if (twitter.player && whitelistRecord.isAllowed && whitelistRecord.isAllowed('html-meta.embedURL')) { 
            return {
                __allowEmbedURL: true
            };        
        }
    },

    getLink: function(schemaVideoObject, whitelistRecord) {
        return {
            href: schemaVideoObject.embedURL || schemaVideoObject.embedUrl,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            'aspect-ratio': 4/3
        }
    },

    tests: [
        "http://www.msnbc.com/andrea-mitchell-reports/watch/clinton-emails-take-unwanted-spotlight-410353731888"
    ]
};