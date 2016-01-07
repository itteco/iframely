var urlLib = require('url');

module.exports = {

    getMeta: function(url, meta) {

        var canonical = (meta.canonical && meta.canonical.href || meta.canonical) || (meta.og && meta.og.url) || (meta.twitter && meta.twitter.url);

        if (canonical) {

            canonical = urlLib.resolve(url, canonical);

            return {
                canonical: canonical
            };
        }
    }
};