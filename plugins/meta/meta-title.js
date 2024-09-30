export default {

    getMeta: function(meta) {

        if (!/wordpress\.com/i.test(meta.title)) {
            // Aparently, WordPress.com is using title field incorrectly.
            return {
                title: meta.title
            };
        }
    },

    lowestPriority: true    
};
