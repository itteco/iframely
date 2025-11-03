import * as cheerio from 'cheerio';


export default {

    getMeta: function(oembed) {
        if (oembed.description) {
            try {
                return {
                    description: cheerio.load(oembed.description).text()
                };
            } catch (ex) {}
        }
    }
};
