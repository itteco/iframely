export default {

    provides: 'articlebody',

    getData: function(__readabilityEnabled, readability, meta, utils) {
        return {
            articlebody: utils.encodeText(meta.charset, readability.getHTML())
        }
    },

    getVars: function(articlebody) {
        return {
            articlebody: articlebody
        };
    }
};