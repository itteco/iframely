import * as cheerio from 'cheerio';


export default {

    getMeta: function(oembed) {
        if (oembed.description) {
            var $p = cheerio.load('<p></p>')('p');
            try {
                $p.html(oembed.description);
                return {
                    description: $p.text()
                };
            } catch (ex) {}
        }
    }
};
