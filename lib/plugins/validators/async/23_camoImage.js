var crypto = require('crypto');
var isCamoProxyEnabled = !!CONFIG.camo_proxy_key && CONFIG.camo_proxy_host;

module.exports = {
  prepareLink: function (url, link, options, cb) {
    if (!isCamoProxyEnabled) {
      cb();
      return;
    }

    if (link.type.match(/^image/)) {
      var hexDigest, hexEncodedPath;

      hexDigest = crypto.createHmac('sha1', CONFIG.camo_proxy_key).update(link.href).digest('hex');
      hexEncodedPath = (new Buffer(link.href)).toString('hex');

      link.href = [
        CONFIG.camo_proxy_host,
        hexDigest,
        hexEncodedPath
      ].join('/');
    }

    cb();
  }
};
