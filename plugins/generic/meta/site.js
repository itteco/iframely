module.exports = {

    useAlways: true,

    getMeta: function(meta) {
        return {
            site: meta["application-name"]
        }
    }
};