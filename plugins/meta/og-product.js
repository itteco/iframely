module.exports = {

    getMeta: function(og, meta) {

        var price = og.price || (meta.product && meta.product.price);

        return {
            price: price && price.amount,
            currency: price && price.currency,
            brand: og.brand,
            product_id: og.upc || og.ean || og.isbn,
            availability: og.availability || meta.availability
        };
    }
};
