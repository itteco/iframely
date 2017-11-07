var oembedUtils = require('./oembedUtils');

module.exports = {

    provides: ['self', 'oembedError'],

    getData: function(url, oembedLinks, options, cb) {

        var href = oembedLinks[0].href;

        var skip = false, self_endpoint = false;

        if (CONFIG.SKIP_OEMBED_RE_LIST) {
            var i;
            for(i = 0; i < CONFIG.SKIP_OEMBED_RE_LIST.length && !skip; i++) {
                skip = href.match(CONFIG.SKIP_OEMBED_RE_LIST[i]);
            }
        }

        if (CONFIG.SELF_OEMBED_POINT_RE_LIST) {
            var i;
            for(i = 0; i < CONFIG.SELF_OEMBED_POINT_RE_LIST.length && !self_endpoint; i++) {
                self_endpoint = href.match(CONFIG.SELF_OEMBED_POINT_RE_LIST[i]);
            }
        }

        if (skip || self_endpoint) {
            return cb(null);
        }

        oembedUtils.getOembed(href, options, function(error, oembed) {

            if (error) {
                return cb('Oembed error "'+ oembedLinks[0].href + '": ' + error, {
                    oembedError: error
                });
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