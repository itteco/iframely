exports.getHtmlparserResponseCacheKey = function(url, whitelistRecord, options) {

    var key = 'htmlparser:' + url;

    var whitelistHash = whitelistRecord && whitelistRecord.getRecordHash();
    if (whitelistHash) {
        key += ':' + whitelistHash;
    }

    var lang = options.getProviderOptions('locale');
    if (lang) {
        key += ':' + lang;
    }

    return key;
};

module.exports.notPlugin = true;