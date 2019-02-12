module.exports = {

    getMeta: function(ld) {

        if (ld.product) {
            return {
                price: ld.product.price,
                currency: ld.product.currency_code || ld.product.currency || ld.product.priceCurrency || ld.product.pricecurrency,
                brand: ld.product.brand,
                category: ld.product.category,
                availability: ld.product.availability,
                offers: ld.product.offers,
                title: ld.product.name,
                description: ld.product.description
            };
        }
    }
};
