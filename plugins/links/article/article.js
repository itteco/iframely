import * as cheerio from 'cheerio';

export default {

    provides: 'articlebody', // if not yet provided from LD articlebody

    getData: function(__readabilityEnabled, $readability, articleHtml, meta, utils) {

        const $p = $readability('p');
        const articleText = $p.text();

        if (articleText) {
            return {
                articlebody: __readabilityEnabled === 'html' ? articleHtml : articleText.replace(/\.([^\.\d\s\n\r\'\"\”\)\]])/g, '. $1')
            }
        }
    },

    getVars: function(articlebody) {
        return {
            articlebody: articlebody
        };
    }
};
