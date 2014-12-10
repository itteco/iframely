module.exports = {

    provides: '__promoUri',

    getData: function(meta) {
        if (meta.promo) {
            return {
                __promoUri: meta.promo
            };
        }
    }
};