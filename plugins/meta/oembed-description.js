import cheerio from 'cheerio';


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