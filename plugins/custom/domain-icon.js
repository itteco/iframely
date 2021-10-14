// use this mixin for domain plugins where you do not want to pull out htmlparser but do need an icon or logo
import * as core from '../../lib/core.js';
import * as cache from '../../lib/cache.js';
import * as async from 'async';
import * as _ from 'underscore';
import log from '../../logging.js';

export default {

    provides: 'domain_icons',

    getLinks: function(domain_icons) {
        return domain_icons;
    },

    getData: function(url, cb, options) {

        // find domain and protocol
        var domain, protocol;
        var m = url.toLowerCase().match(/^(https?:\/\/)([^/]+)\/(.)/i);
        
        if (m && (m[1] + m[2] !== url)) {
            domain = m[2];
            protocol = m[1];
        } else {
            // prevent self recursion for root domains like http://domain.com.
            return cb();
        }

        var domainUri = protocol + domain;
        var key = 'ha:domain_icon:' + domain;

        if (options.debug) {
            key += ':debug';
        }

        async.waterfall([

            function(cb) {
                cache.get(key, cb);
            },

            function(data, cb) {

                if (data) {

                    // Ask 'checkFavicon' to skip check.
                    data.forEach(function(link) {
                        link._imageStatus = {doNotCheck: true};
                    });

                    cb(null, {
                        domain_icons: data
                    });

                } else {

                    if (!options.forceSyncCheck) {
                        // On cache miss hard code domain icon to favicon.ico.

                        cb(null, {
                            domain_icons: [{
                                href: `${domainUri}/favicon.ico`,
                                type: CONFIG.T.image,
                                rel: [CONFIG.R.icon, CONFIG.R.iframely] // It will be validated as image.
                            }]
                        }); 
                    }

                    // and asynchronously put in cache for next time
                    // + run icons validation right away

                    // forceSyncCheck - ask 'checkFavicon' to check favicon this time before callback.
                    core.run(domainUri, _.extend({}, options, {forceSyncCheck: true}), function(error, data) {

                        var icons;

                        if (data && data.links) {

                            // do need to set cache here as domains may redirect, 
                            // e.g. http ->https, then http urls will always miss icons.

                            icons = data.links.filter(function(link) {
                                return link.rel.indexOf(CONFIG.R.icon) > -1;
                            });
                        } else {
                            icons = [];
                        }
                        
                        if (options.forceSyncCheck) {
                            // skip domain icon on cache miss 
                            cb (null, {domain_icons: icons}); 
                        }

                        if (icons.length === 0) {
                            log('[domain-icons] no icons for', domainUri)
                        }

                        cache.set(key, icons, {ttl: icons.length > 0 ? CONFIG.IMAGE_META_CACHE_TTL : CONFIG.CACHE_TTL_PAGE_TIMEOUT});
                    });
                }
            }

        ], function(error, data) {
            return cb(null, data);
        });
    },

    tests: {
        skipTestAsMixin: true
    }

};