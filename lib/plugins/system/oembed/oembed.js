var oembedUtils = require('./oembedUtils');

module.exports = {

    provides: 'self',

    getData: function(url, oembedLinks, options, cb) {

        var href = oembedLinks[0].href;

        var skip = false;

        if (CONFIG.SKIP_OEMBED_RE_LIST) {
            var i;
            for(i = 0; i < CONFIG.SKIP_OEMBED_RE_LIST.length; i++) {
                skip = skip || href.match(CONFIG.SKIP_OEMBED_RE_LIST[i]);
            }
        }

        if (skip) {
            return cb(null);
        }

        oembedUtils.getOembed(href, function(error, oembed) {

            if (error) {
                return cb('Oembed error "'+ oembedLinks[0].href + '": ' + error);
            }

            var result = {
                oembed: oembed
            };

            // If no domain whitelist record - search record by oembed endpoint.
            if (options.getWhitelistRecord) {
                var currentWhitelistRecord = options.getWhitelistRecord(url, {disableWildcard: true});
                var oembedWhitelistRecord = options.getWhitelistRecord(href, {exclusiveRel: 'oembed'});
                if (oembedWhitelistRecord && !oembedWhitelistRecord.isDefault && (!currentWhitelistRecord || currentWhitelistRecord.isDefault)) {
                    result.whitelistRecord = oembedWhitelistRecord
                }
            }

            cb(null, result);
        });
    }
};