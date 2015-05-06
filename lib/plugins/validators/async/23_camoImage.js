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

    prepareLink: function (url, link, options, cb) {

        if (!link.href || !CONFIG.providerOptions.camoProxy || !isImage(link) || isSSL(link)) {
            return cb();
        }

        var hexDigest, hexEncodedPath;

        hexDigest = crypto.createHmac('sha1', CONFIG.providerOptions.camoProxy.camo_proxy_key).update(link.href).digest('hex');
        hexEncodedPath = (new Buffer(link.href)).toString('hex');

        link.href = [
            CONFIG.providerOptions.camoProxy.camo_proxy_host,
            hexDigest,
            hexEncodedPath
        ].join('/');

        cb();
    }
};
