module.exports = {

    getMeta: function(meta) {

        if (!meta.og)
            return;

        return {
            description: meta.og.description
        };
    }
};