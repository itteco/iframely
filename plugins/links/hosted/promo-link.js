export default {

    provides: '__promoUri',

    getData: function(meta, options) {

        var appname = options.getProviderOptions('app.name', 'iframely');
        var data = meta[appname] || meta.iframely || meta;

        if (data.attach || data.promo) {
            return {
                __promoUri: data.attach || data.promo
            };
        }
    }
};