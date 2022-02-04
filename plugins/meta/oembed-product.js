export default {

    getMeta: function(oembed) {

        if (oembed.price) { // non-shopify products, per pinterest spec
            return {
                price: oembed.price && parseFloat(oembed.price),
                currency: oembed.currency_code || oembed.currency,
                brand: oembed.brand,
                availability: oembed.availability
            }
        } else if (oembed.offers && oembed.offers.length > 0) { // shopify
            var offer = oembed.offers[0]; // let's take the first one
            return {
                price: offer.price && parseFloat(offer.price),
                currency: offer.currency_code,
                offers: oembed.offers,
                brand: oembed.brand
            };
        } 
    }
};
