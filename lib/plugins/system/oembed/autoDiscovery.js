var oembedUtils = require('./oembedUtils');

module.exports = {

    provides: 'oembedLinks',

    /*
    * "__" two underscores means super mandatory param. Without that param plugin dependencies will not be searched.
    *
    * */
    getData: function(meta, __noOembedLinks) {

        var oembedLinks = oembedUtils.findOembedLinks(null, meta);

        if (oembedLinks && oembedLinks instanceof Array) {

            oembedLinks = oembedLinks.filter(function(link) {

                return !(CONFIG.BLACKLIST_DOMAINS_RE && CONFIG.BLACKLIST_DOMAINS_RE instanceof Array 
                    && CONFIG.BLACKLIST_DOMAINS_RE.some(function(el) {

                        return el instanceof RegExp && el.test(link.href);

                    }));
            });
        }

        if (oembedLinks && oembedLinks.length > 0) {
            return {oembedLinks: oembedLinks}
        }

    }
};