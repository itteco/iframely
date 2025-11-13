import * as cheerio from 'cheerio';

export default {

    provides: 'articlebody', // if not yet provided from LD articlebody

    getData: function(__readabilityEnabled, readability, meta, utils) {

        const articleHtml = utils.encodeText(meta.charset, readability.getHTML());
        const $p = cheerio.load(articleHtml)('p');

        if ($p.text()) {
            return {
                articlebody: articleHtml
            }
        }
    },

    getVars: function(articlebody) {
        return {
            articlebody: articlebody
        };
    }
};