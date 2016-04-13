var HTMLMetaHandler = require('./HTMLMetaHandler');
var cache = require('../../../cache');
var sysUtils = require('../../../../logging');
var iconv = require('iconv-lite');

module.exports = {

    provides: 'self',

    getData: function(url, htmlparser, __noCachedMeta, cb) {

        var metaHandler = new HTMLMetaHandler(
            url,
            htmlparser.request.response.headers["content-type"],
            function(error, meta) {
                //console.log('meta', error, meta);
                if (error) {
                    return cb(error);
                }

                // Add ISO-2022-JP encoding #60
                // https://github.com/ashtuchkin/iconv-lite/issues/60

                if (!iconv.encodingExists(meta.charset)) {
                    sysUtils.log('   -- Unsupported encoding: ' + meta.charset + ' in ' + url);
                    return cb({
                        responseStatusCode: 415
                    });
                }

                if (meta.refresh && !(meta['html-title'] && meta['html-title'] !== '')) {
                    return cb({
                        redirect: meta.refresh
                    });
                }

                var meta_key = 'meta:' + url;
                cache.set(meta_key, meta);

                cb(null, {
                    meta: meta
                });
            });

        htmlparser.addHandler(metaHandler);
    }

};