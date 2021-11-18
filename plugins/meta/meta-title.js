export default {

    getMeta: function(meta) {

        if (meta.title && meta.title.toLowerCase().indexOf('wordpress.com') == -1) {
            // Aparently, WordPress.com is using title field incorrectly.
            return {
                title: meta.title
            };
        }
    },

    lowestPriority: true    
};
