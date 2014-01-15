var oembedUtils = require('./oembedUtils');

module.exports = {

    provides: 'oembedLinks',

    getData: function(meta) {
        return {
            oembedLinks: oembedUtils.findOembedLinks(null, meta)
        };
    }
};