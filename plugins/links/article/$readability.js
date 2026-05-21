import * as cheerio from 'cheerio';

export default {

    provides: [
        '$readability',
        'articleHtml'
    ],

    getData: function(__readabilityEnabled, readabilitySAX, meta, utils) {

        const articleHtml = utils.encodeText(meta.charset, readabilitySAX.getHTML());
        const $readability = cheerio.load(articleHtml);

        return {
            $readability,
            articleHtml
        };
    }
};
