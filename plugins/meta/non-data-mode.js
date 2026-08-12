export default {

    provides: "__nonDataMode",

    getData: function(options) {

        if (!options.dataMode) {
            return {
                __nonDataMode: true
            }
        }
    }
}