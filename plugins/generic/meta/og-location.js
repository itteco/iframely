module.exports = {

    getMeta: function(meta) {

        if (!meta.og)
            return;

        return {
            latitude: meta.og["latitude"],
            longitude: meta.og["longitude"],
            "street-address": meta.og["street-address"],
            locality: meta.og["locality"],
            region: meta.og["region"],
            "postal-code": meta.og["postal-code"],
            "country-name": meta.og["country-name"]
        }
    }
};