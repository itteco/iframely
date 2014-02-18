module.exports = {

    provides: 'self',

    getData: function(meta) {
        return {
            twitter: meta.twitter
        };
    }
};