export default {

    getMeta: function(meta) {
        return {
            amphtml: meta.amphtml || meta ['alternate amphtml']
        };
    }
};
