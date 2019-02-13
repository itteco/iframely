module.exports = {

    highestPriority: true,

    getMeta: function(ld) {

        if (ld.product) {
            return {
                price: ld.product.price,
                currency: ld.product.currency_code || ld.product.currency || ld.product.priceCurrency || ld.product.pricecurrency,
                brand: (ld.product.brand && ld.product.brand.name) || ld.product.brand,
                category: ld.product.category,
                availability: ld.product.availability,
                title: ld.product.name,
                description: ld.product.description
            };
        }
    }
};
