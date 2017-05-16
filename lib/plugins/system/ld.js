module.exports = {

    provides: 'self',

    getData: function(meta) {
        return {
            ld: meta.ld
        };
    }
};