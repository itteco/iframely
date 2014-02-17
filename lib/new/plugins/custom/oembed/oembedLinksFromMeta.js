var oembedUtils = require('./oembedUtils');

module.exports = {

    provides: 'oembedLinks',

    // TODO: prevent starting plugin before oembedLinksFromUri.

    getData: function(meta) {
        return {
            oembedLinks: oembedUtils.findOembedLinks(null, meta)
        };
    }
};