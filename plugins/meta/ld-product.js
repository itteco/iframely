import cheerio_pkg from 'cheerio';
const cheerio = cheerio_pkg.default;

export default {

    highestPriority: true,

    getMeta: function(ld) {

        if (ld.product) {
            var description = ld.product.description;
            if (description) {
                var $container = cheerio('<div>');
                try {
                    $container.html(description);
                } catch (ex) {}
                description = $container.text() || undefined;
            }
            return {
                price: ld.product.price,
                currency: ld.product.currency_code || ld.product.currency || ld.product.priceCurrency || ld.product.pricecurrency,
                brand: (ld.product.brand && ld.product.brand.name) || ld.product.brand,
                category: ld.product.category,
                availability: ld.product.availability,
                title: ld.product.name,
                description: description
            };
        }
    }
};
