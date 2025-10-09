export default {

    provides: 'self',

    listed: true,

    getData: function(meta) {
        return {
            og: meta.og
        };
    }
};
