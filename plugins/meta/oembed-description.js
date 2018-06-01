var cheerio = require('cheerio');

module.exports = {

    getMeta: function(oembed) {

		var $p = cheerio('<p>');
		try {
			$p.html(oembed.description);
			return {
				description: $p.text()
			}
		} catch (ex) {}
    }
};