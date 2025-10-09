import { HTMLMetaHandler } from './HTMLMetaHandler.js';
import { cache } from '../../../cache.js';
import log from '../../../../logging.js';
import * as libUtils from '../../../utils.js';
import iconv from 'iconv-lite';
import * as utils from './utils.js';

export default {

    provides: 'self',

    listed: true,

    getData: function(url, htmlparser, whitelistRecord, options, __noCachedMeta, cb) {

        var metaHandler = new HTMLMetaHandler(
            url,
            htmlparser.headers["content-type"],
            function(error, meta) {

                htmlparser.removeHandler(metaHandler);

                //console.log('meta', error, meta);
                if (error) {
                    return cb(error);
                }

                // Add ISO-2022-JP encoding #60
                // https://github.com/ashtuchkin/iconv-lite/issues/60

                if (!iconv.encodingExists(meta.charset)) {
                    log('   -- Unsupported encoding: ' + meta.charset + ' in ' + url);
                    return cb({
                        responseStatusCode: 415
                    });
                }

                var meta_key = utils.getMetaCacheKey(url, whitelistRecord, options);
                var ttl = libUtils.getMaxCacheTTL(url, options);

                if (ttl === 0 && CONFIG.META_TEMP_TTL) {
                    ttl = CONFIG.META_TEMP_TTL;
                }

                // Do not store to cache with ttl == 0.
                if (ttl !== 0) {

                    cache.set(meta_key, Object.assign({
                        // Store `_sys_created_at` seconds creation time.
                        _sys_created_at: Math.floor(new Date().getTime() / 1000),
                        _sys_headers: htmlparser.headers
                    }, meta), {
                        ttl: ttl
                    });

                    if (options.refresh) {
                        log('   -- Refreshed meta cache for: ' + url);
                    }
                }

                cb(null, {
                    meta: meta
                });
            });

        htmlparser.addHandler(metaHandler);
    }

};
