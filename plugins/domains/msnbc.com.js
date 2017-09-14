module.exports = {

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "dc",
        "og-description",
        "embedurl-meta",
        "keywords",
        "media-detector",
        "og-site",
        "og-title"
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
        return [{
                href: schemaVideoObject.embedURL || schemaVideoObject.embedUrl,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                type: CONFIG.T.text_html,
                'aspect-ratio': 16/9,
                'padding-bottom': 75,
                scrolling: 'no'}, {
        }, {
                href: schemaVideoObject.contentURL || schemaVideoObject.contentUrl,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                type: CONFIG.T.video_mp4,
                'aspect-ratio': 16/9
        }];
    },

    tests: [
        "http://www.msnbc.com/andrea-mitchell-reports/watch/clinton-emails-take-unwanted-spotlight-410353731888",
        "http://www.msnbc.com/all-in/watch/donald-trump-gets-a-royal-snub-973255235721"
    ]
};