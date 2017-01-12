module.exports = {

    getMeta: function(oembed) {

        if (oembed.type == "product") {
            return {
                price: oembed.price && parseFloat(oembed.price),
                currency: oembed.currency_code,
                brand: oembed.brand,
                product_id: oembed.product_id,
                availability: oembed.availability,
                quantity: oembed.quantity && parseInt(oembed.quantity),
                offers: oembed.offers
            };
        } else if (oembed.price) { // non-shopify products, per pinterest spec

            return {
                price: oembed.price && parseFloat(oembed.price),
                currency: oembed.currency_code || oembed.currency,
                availability: oembed.availability
            }
        }
    }
};
