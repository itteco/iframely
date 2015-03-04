module.exports = {

    highestPriority: true,

    getMeta: function(meta) {
        return {
            site: meta["application-name"]
        }
    }
};