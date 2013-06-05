module.exports = {

    lowestPriority: true,

    getMeta: function(meta) {

        if (!meta.og)
            return;

        return {
            site: meta.og.site_name
        };
    }
};