export default {

    provides: 'self',

    getData: function(meta) {
        if (meta.ld) {
            return {
                ld: meta.ld
            };
        }
    }
};