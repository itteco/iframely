module.exports = {

    // https://developers.pinterest.com/docs/rich-pins/products/?
    getMeta: function(og, meta) {

        var price = og.price || (meta.product && meta.product.price);

        return {
            price: price && (price.amount || price.standard_amount),
            currency: price && price.currency,
            brand: og.brand,
            product_id: og.upc || og.ean || og.isbn,
            availability: og.availability || meta.availability
        };
    }
};
