module.exports = {

    getMeta: function(meta) {

        var og = meta.og;

        if (!og)
            return;

        var price = og.price || (meta.product && meta.product.price);

        return {
            price: price.amount || price.amount,
            currency: price.currency || price.currency,
            brand: og.brand,
            product_id: og.upc || og.ean || og.isbn,
            availability: og.availability || meta.availability
        };
    }
};
