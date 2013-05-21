module.exports = {

    lowestPriority: true,

    getMeta: function(meta) {
        return {
            author: meta.twitter.creator
        };
    }
};