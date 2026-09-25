export default {

    getMeta: function(ld) {

        if (ld.product) {
            return {
                medium: 'product'
            };
        }
    }
};
