module.exports = {

    provides: '__promoUri',

    getData: function(meta, whitelistRecord) {
        if (meta.promo && whitelistRecord.isAllowed && whitelistRecord.isAllowed('html-meta.promo')) {
            return {
                __promoUri: meta.promo
            };
        }
    }
};