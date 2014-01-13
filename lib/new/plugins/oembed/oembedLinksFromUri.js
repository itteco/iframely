var oembedUtils = require('./oembedUtils');

module.exports = {

    getData: function(meta) {
        return {
            oembedLinks: oembedUtils.findOembedLinks(null, meta)
        };
    }
};