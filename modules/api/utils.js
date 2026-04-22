import { fetchData } from "../../lib/fetch.js";

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

const HTML_ESCAPE_MAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};

function escapeHTML(value) {
    if (typeof value !== "string") {
        return value;
    }
    return value.replace(/[&<>"']/g, char => HTML_ESCAPE_MAP[char]);
}

function normalizeValue(value) {
    if (value === 'true') {
        return true;
    }
    if (value === 'false') {
        return false;
    }
    if (/^\d+$/.test(value)) {
        return parseInt(value);
    }
    if (/^(\d+)?\.\d+$/.test(value)) {
        return parseFloat(value);
    }
    if (typeof value === 'string') {
        // Escape string value in case it will be used in html.
        return escapeHTML(value);
    }
    // Return nothing if unknown type or array.
    return;
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
            var value = normalizeValue(query[key]);
            if (typeof value !== 'undefined') {
                providerOptions[key] = value;
            }
        }
    }

    // Move `query.maxwidth` to `providerOptions.maxwidth`.
    var maxWidth = normalizeValue(query['maxwidth']);
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
