export function getMetaCacheKey(url, whitelistRecord, options) {

    var meta_key = 'meta:' + url;

    var whitelistHash = whitelistRecord && whitelistRecord.getRecordHash();
    if (whitelistHash) {
        meta_key += ':' + whitelistHash;
    }

    var lang = options.getProviderOptions('locale');
    if (lang) {
        meta_key += ':' + lang;
    }

    return meta_key;
};

export const notPlugin = true;