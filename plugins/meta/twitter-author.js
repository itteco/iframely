module.exports = {

    lowestPriority: true,

    getMeta: function(twitter) {

        if (!twitter.creator || twitter.creator == twitter.site) {
            return;
        }

        return {
            author: (twitter.creator.value || twitter.creator).replace(/^@/, '')
        };
    }
};