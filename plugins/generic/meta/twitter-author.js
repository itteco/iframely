module.exports = {

    lowestPriority: true,

    getMeta: function(twitter) {

        if (!twitter.creator)
            return;

        return {
            author: meta.twitter.creator.value || meta.twitter.creator
        };
    }
};