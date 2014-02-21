var oembedUtils = require('./oembedUtils');

module.exports = {

    provides: 'oembedLinks',

    /*
    * "__" two underscores means super mandatory param. Without that param plugin dependencies will not be searched.
    *
    * */
    getData: function(meta, __noOembedLinks) {
        return {
            oembedLinks: oembedUtils.findOembedLinks(null, meta)
        };
    }
};