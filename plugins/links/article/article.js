import * as cheerio from 'cheerio';

export default {

    provides: 'articlebody', // if not yet provided from LD articlebody

    getData: function(__readabilityEnabled, readability, meta, utils) {

        const articleHtml = utils.encodeText(meta.charset, readability.getHTML());
        const $p = cheerio.load(articleHtml)('p');
        const articleText = $p.text();

        if (articleText) {
            return {
                articlebody: __readabilityEnabled === 'html' ? articleHtml : articleText
            }
        }
    },

    getVars: function(articlebody) {
        return {
            articlebody: articlebody
        };
    }
};