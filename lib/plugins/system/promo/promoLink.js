module.exports = {

    provides: '__promoUri',

    generic: true,

    getData: function(meta) {
        if (meta.promo) {
            return {
                __promoUri: meta.promo
            };
        }
    }
};