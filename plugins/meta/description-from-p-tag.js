import { decodeHTML5 } from 'entities';

export default {

    lowestPriority: true,
    provides: '__allowPTagDescription',

    getMeta: function(cheerio, decode, __allowPTagDescription) {
        // Get the text from the first <p> tag that's not in a header
        var description;
        cheerio("body p").each(function() {
            var $p = cheerio(this);
            if ($p.children("label, input, button, div").length === 0 && !$p.parents("noscript, header,#header,[role='banner']").length) {
                var someText = decodeHTML5(decode($p.text()));
                var requiredLimit = Number.isInteger(__allowPTagDescription) ? __allowPTagDescription : 64;
                if (someText.length > requiredLimit) {
                    description = someText;
                    return false;
                }
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
                __allowPTagDescription: options.getProviderOptions('app.allowPTagDescription') || true
            }            
        }
    }
};
