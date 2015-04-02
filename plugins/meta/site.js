module.exports = {

    lowestPriority: true,

    getMeta: function(meta) {
        return {
            site: meta["application-name"]
        }
    }
};