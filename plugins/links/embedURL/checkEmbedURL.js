module.exports = {

    provides: '__allowEmbedURL',

    getData: function(whitelistRecord) {
        if (whitelistRecord && whitelistRecord.isAllowed('html-meta.embedURL')) {
            return {
                __allowEmbedURL: true
            };
        }
    }
};