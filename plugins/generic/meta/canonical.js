module.exports = {

    getMeta: function(meta) {
        return {
            canonical: meta.canonical || (meta.og && meta.og.url) || (meta.twitter && meta.twitter.url)
        }
    }
};