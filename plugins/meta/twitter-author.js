module.exports = {

    lowestPriority: true,

    getMeta: function(twitter) {

        if (!twitter.creator)
            return;

        return {
            author: (twitter.creator.value || twitter.creator).replace(/^@/, '')
        };
    }
};