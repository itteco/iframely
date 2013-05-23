module.exports = {

    useAlways: true,

    lowestPriority: true,

    getMeta: function(meta) {
        return {
            site: meta.og.site_name
        };
    }
};