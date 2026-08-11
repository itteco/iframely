export default {

    getMeta: function(url, meta, options) {

        var canonical = (meta.canonical && meta.canonical.href || meta.canonical) || (meta.og && meta.og.url) || (meta.twitter && meta.twitter.url);

        if ((!canonical || /^https?:\/\//i.test(canonical)) && !options.dataMode) {
            canonical = url;
        }

        if (typeof canonical === 'string') {
            return {
                canonical: canonical
            };
        }
    }
};