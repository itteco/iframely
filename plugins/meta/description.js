export default {

    lowestPriority: true,

    getMeta: function(meta) {

        var d = meta.metaDescription || meta.description || meta.Description;

        if (d && d instanceof Array) {
            d = d[0];
        }

        return {
            description: d
        }
    }
};