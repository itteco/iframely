var crypto = require('crypto');
var isCamoProxyEnabled = !!CONFIG.camo_proxy_key && CONFIG.camo_proxy_host;

function isSSL(link) {
  return link.rel.indexOf('ssl') > -1;
}

function isImage(link) {
  return link.type.match(/^image/);
}

module.exports = {
  prepareLink: function (url, link, options, cb) {
    if (!isCamoProxyEnabled || !isImage(link) || isSSL(link)) {
      cb();
      return;
    }

    var hexDigest, hexEncodedPath;

    hexDigest = crypto.createHmac('sha1', CONFIG.camo_proxy_key).update(link.href).digest('hex');
    hexEncodedPath = (new Buffer(link.href)).toString('hex');

    link.href = [
      CONFIG.camo_proxy_host,
      hexDigest,
      hexEncodedPath
    ].join('/');

    cb();
  }
};
