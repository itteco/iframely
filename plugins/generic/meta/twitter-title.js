module.exports = {

    getMeta: function(meta) {

        if (!meta.twitter)
            return;

        return {
            title: meta.twitter.title
        };
    }
};
