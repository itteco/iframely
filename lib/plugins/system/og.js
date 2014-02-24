module.exports = {

    provides: 'self',

    getData: function(meta) {
        return {
            og: meta.og
        };
    }
};