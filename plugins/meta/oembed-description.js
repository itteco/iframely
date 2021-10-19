import cheerio_pkg from 'cheerio';
const cheerio = cheerio_pkg.default;

export default {

    getMeta: function(oembed) {
        if (oembed.description) {
            var $p = cheerio('<p>');
            try {
                $p.html(oembed.description);
                return {
                    description: $p.text()
                };
            } catch (ex) {}
        }
    }
};