var oembedUtils = require('./oembedUtils');

module.exports = {

    provides: ['oembedLinks', '__noOembedLinks'],

    getData: function(uri) {
        var oembedLinks = oembedUtils.findOembedLinks(uri);
        return {
            oembedLinks: oembedLinks,
            __noOembedLinks: !oembedLinks || !oembedLinks.length || null    // null - means value not in context.
        };
    }
};