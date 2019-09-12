var HTMLMetaHandler = require('./HTMLMetaHandler');
var cache = require('../../../cache');
var sysUtils = require('../../../../logging');
var libUtils = require('../../../utils');
var iconv = require('iconv-lite');
var utils = require('./utils');

module.exports = {

    provides: 'self',

    getData: function(url, htmlparser, whitelistRecord, options, __noCachedMeta, cb) {

        var metaHandler = new HTMLMetaHandler(
            url,
            htmlparser.request.response.headers["content-type"],
            function(error, meta) {

                htmlparser.removeHandler(metaHandler);

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

                var meta_key = utils.getMetaCacheKey(url, whitelistRecord, options);
                var ttl = libUtils.getMaxCacheTTL(url, options);
                // Do not store to cache with ttl == 0.
                if (ttl !== 0) {

                    cache.set(meta_key, meta, {
                        ttl: ttl
                    });

                    if (options.refresh) {
                        sysUtils.log('   -- Refreshed meta cache for: ' + url);
                    }
                }

                cb(null, {
                    meta: meta
                });
            });

        htmlparser.addHandler(metaHandler);
    }

};