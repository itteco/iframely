module.exports = {

    getMeta: function(meta) {

        if (!meta.DC) {
            return;
        }

        return {
            title: meta.DC.title
        };
    }
};