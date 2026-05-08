import { fetchData } from "../../lib/fetch.js";
import { normalizeQueryOptionValue } from "../../utils.js";

var _RE = /^_.+/;

export function getProviderOptionsQuery(query) {
    var providerOptionsQuery = {};

    for(var key in query) {
        if (key.length > 1 && _RE.test(key)) {
            providerOptionsQuery[key] = query[key];
        }
    }

    return providerOptionsQuery;
}

export function getProviderOptionsFromQuery(query) {
    /*
    Convert '_option=value' to 
    providerOptions = {
        _: {
            options: value
        }
    }
    */

    var providerOptions = {};

    for(var key in query) {
        if (key.length > 1 && _RE.test(key)) {
            var value = normalizeQueryOptionValue(query[key]);
            if (typeof value !== 'undefined') {
                providerOptions[key] = value;
            }
        }
    }

    // Move `query.maxwidth` to `providerOptions.maxwidth`.
    var maxWidth = normalizeQueryOptionValue(query['maxwidth']);
    if (maxWidth) {
        providerOptions.maxwidth = maxWidth;
    }

    return providerOptions;
}

function getSigHeaders(url, cb) {
    const sigUrl = new URL(CONFIG.SIG_API);
    sigUrl.searchParams.append('url', url);
    fetchData({
        uri: sigUrl,
        json: true
    })
    .then(result => {
        cb(null, result.data);
    })
    .catch(cb);;
}

export function getSigHeadersFunction() {
    if (CONFIG.SIG_API) {
        return getSigHeaders;
    }
}
