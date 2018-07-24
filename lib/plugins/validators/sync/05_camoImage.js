/*
Should be last async plugin to prevent size check over camo.
*/

var crypto = require('crypto');

function isSSL(link) {
    return link.rel.indexOf('ssl') > -1;
}

function isImage(link) {
    return link.type.match(/^image/);
}

module.exports = {

    // Get from default CONFIG. Not supposed to be enabled by dynamic custom provider options.
    notPlugin: !CONFIG.providerOptions.camoProxy,

    prepareLink: function (link, options) {

        var camo_proxy_key = options.getProviderOptions('camoProxy.camo_proxy_key');
        var camo_proxy_host = options.getProviderOptions('camoProxy.camo_proxy_host');

        if (!camo_proxy_key || !camo_proxy_host || !link.href || !isImage(link) || (options.getProviderOptions('camoProxy.ssl_only') && isSSL(link))) {
            return;
        }

        var hexDigest, hexEncodedPath;

        hexDigest = crypto.createHmac('sha1', camo_proxy_key).update(link.href).digest('hex');
        hexEncodedPath = new Buffer(link.href).toString('hex');

        link.href = [
            camo_proxy_host,
            hexDigest,
            hexEncodedPath
        ].join('/');

    }
};
