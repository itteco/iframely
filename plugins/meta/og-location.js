export default {

    getMeta: function(og) {

        return {
            latitude: og["latitude"],
            longitude: og["longitude"],
            "street-address": og["street-address"],
            locality: og["locality"],
            region: og["region"],
            "postal-code": og["postal-code"],
            "country-name": og["country-name"]
        }
    }
};