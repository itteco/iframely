var cheerio = require('cheerio');

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