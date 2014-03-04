module.exports = {

    notPlugin:  !(CONFIG.providerOptions.readability && CONFIG.providerOptions.readability.enabled === true),

    provides: '__enable_readability',

    getData: function(meta) {

        if (meta.og && (meta.og.type === "article" || meta.og.type === "blog")) {

            return {
                __enable_readability: true
            };
        }
    }
};