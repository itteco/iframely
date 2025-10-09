export default {

    provides: 'self',

    listed: true,

    getData: function(meta) {
        if (meta.ld) {
            return {
                ld: meta.ld
            };
        }
    }
};
