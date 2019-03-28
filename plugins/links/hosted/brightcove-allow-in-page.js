module.exports = {

    provides: '__allowBrightcoveInPage',

    getData: function(meta, whitelistRecord) {

        // Allow slow cheerio parser, if whitelisted,
        // But do not call, if there is twitter:player
        if (whitelistRecord.isAllowed('html-meta.brightcoveInPage')) {

            return {
                __allowBrightcoveInPage: whitelistRecord.isAllowed('html-meta.brightcoveInPage', 'autoplay') ? 'autoplay': true
            };
        }
    }

}