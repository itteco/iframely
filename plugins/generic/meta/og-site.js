module.exports = {

    useAlways: true,

    lowestPriority: true,

    getMeta: function(meta) {

        if (!meta.og)
            return;

        return {
            site: meta.og.site_name
        };
    }
};