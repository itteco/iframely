module.exports = {

    provides: '__enable_readability',

    getData: function(meta, readabilityEnabled) {

        if (meta.og && (meta.og.type === "article" || meta.og.type === "blog")) {

            return {
                __enable_readability: true
            };
        }
    }
};