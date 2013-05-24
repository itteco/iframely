module.exports = {

    getMeta: function(meta) {

        if (!meta.og)
            return;

        return {
            title: meta.og.title
        };
    }
};
