var oembedUtils = require('./oembedUtils');

module.exports = {

    provides: 'oembedLinks',

    getData: function(uri) {
        return {
            oembedLinks: oembedUtils.findOembedLinks(uri)
        };
    }
};