export default {

    listed: true,

    provides: 'self',

    getData: function(meta) {
        return {
            og: meta.og
        };
    }
};
