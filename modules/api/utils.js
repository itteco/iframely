var _RE = /^_.+/;

exports.getProviderOptionsQuery = function(query) {
    var providerOptionsQuery = {};

    for(var key in query) {
        if (key.length > 1 && _RE.test(key)) {
            providerOptionsQuery[key] = query[key];
        }
    }

    return providerOptionsQuery;
}

function normalizeValue(value) {
    if (value === 'true') {
        return true;
    }
    if (value === 'false') {
        return false;
    }
    if (value.match(/^\d+$/)) {
        return parseInt(value);
    }
    if (value.match(/^(\d+)?\.\d+$/)) {
        return parseFloat(value);
    }
    return value;
}

exports.getProviderOptionsFromQuery = function(query) {
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
            var realKey = key.substr(1);
            providerOptions._ = providerOptions._ || {};
            providerOptions._[realKey] = value;
        }
    }

    return providerOptions;
}