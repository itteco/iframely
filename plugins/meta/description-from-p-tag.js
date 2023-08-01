import { decodeHTML5 } from 'entities';

export default {

    lowestPriority: true,
    provides: '__allowPTagDescription',

    getMeta: function(cheerio, decode, __allowPTagDescription) {
        // Get the text from the first <p> tag that's not in a header
        var description;
        cheerio("body p").each(function() {
            var $p = cheerio(this);

            if (!$p.parents("noscript, header,#header,[role='banner']").length) {
                description = decodeHTML5(decode($p.text()));
                return false;
            }
        });

        if (description) {
            return {
                description: description
            }
        }
    },

    getData: function(meta, options) {
        if (options.getProviderOptions('app.allowPTagDescription', CONFIG.providerOptions?.readability?.allowPTagDescription)
            && !meta.description && !meta.twitter?.description && !meta.og?.description) {
            return {
                __allowPTagDescription: true
            }            
        }
    }
};
