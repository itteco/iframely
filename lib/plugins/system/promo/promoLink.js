module.exports = {

    provides: '__promoUri',

    generic: true,

    getData: function(meta, whitelistRecord, options) {
        if (options.forcePromo || meta.promo && whitelistRecord.isAllowed && whitelistRecord.isAllowed('html-meta.promo')) {
            return {
                __promoUri: meta.promo
            };
        }
    }
};