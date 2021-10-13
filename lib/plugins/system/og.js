export default {

    provides: 'self',

    getData: function(meta) {
        return {
            og: meta.og
        };
    }
};