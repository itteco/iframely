module.exports = {

	highestPriority: true,

    getMeta: function(url, meta) {

        var canonical = (meta.canonical && meta.canonical.href || meta.canonical) || (meta.og && meta.og.url) || (meta.twitter && meta.twitter.url);

        if (canonical && typeof canonical === 'string' && /^https?:\/\//i.test(canonical)) {

            return {
                canonical: canonical
            };
        }
    }
};