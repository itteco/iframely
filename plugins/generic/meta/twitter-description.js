module.exports = {

    getMeta: function(meta) {

        if (!meta.twitter)
            return;

        return {
            description: meta.twitter.description
        }
    }
};