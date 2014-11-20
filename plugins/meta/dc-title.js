module.exports = {

    getMeta: function(meta) {

        var dc = meta.dc || meta.dcterms;

        if (dc && dc.title) {
            return {
                title: dc.title
            };
        }
    }
};