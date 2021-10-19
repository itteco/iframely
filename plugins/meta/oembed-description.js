var cheerio = require('cheerio').default;

module.exports = {

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