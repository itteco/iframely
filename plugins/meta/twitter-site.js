module.exports = {

    lowestPriority: true,

    getMeta: function(twitter) {

        return {
            site: (twitter.site && twitter.site.value) || twitter.site
        }
    }
};