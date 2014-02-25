module.exports = {

    getLink: function(oembed, whitelistRecord) {

        if (oembed.type === "link" && oembed.html && whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.link', "reader")) {
            
            return {
                html: oembed.html,
                type: CONFIG.T.safe_html,
                rel: [CONFIG.R.reader, CONFIG.R.inline]
            };
        }
    },

    // TODO: tests.
    tests: [
        "http://finance.fortune.cnn.com/2013/01/04/december-jobs-report/"
    ]
};