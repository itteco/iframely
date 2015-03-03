module.exports = {

    getMeta: function(meta) {

        if (meta.title && meta.title.toLowerCase().indexOf('wordpress.com') == -1) {
            // Aparently, WordPress.com is using title field incorrectly.
            return {
                title: meta.title
            };
        }
    },

    highestPriority: true
    // Example - http://www.wired.com/business/2013/10/slow-nextdoor-raises-fast-money/
};
