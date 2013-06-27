module.exports = {

    lowestPriority: true,

    getMeta: function(meta) {

        if (!meta.twitter || !meta.twitter.creator)
            return;

        return {
            author: meta.twitter.creator.value || meta.twitter.creator
        };
    }
};