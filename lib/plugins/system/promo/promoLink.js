module.exports = {

    provides: '__promoUri',

    generic: true,

    getData: function(meta, whitelistRecord) {
        if (meta.promo && whitelistRecord && whitelistRecord.isAllowed && whitelistRecord.isAllowed('html-meta.promo')) {
            return {
                __promoUri: meta.promo
            };
        }
    }
};