import { decodeHTML5 } from 'entities';

export default {

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

    getData: function(meta) {
        if (!meta.description && !(meta.twitter && meta.twitter.description) && !(meta.og && meta.og.description)) {
            return {
                __allowPTagDescription: true
            }            
        }

    },

    lowestPriority: true,
    provides: '__allowPTagDescription',
    notPlugin: !(CONFIG.providerOptions.readability && CONFIG.providerOptions.readability.allowPTagDescription === true)
};
