// use this mixin for domain plugins where you do not want to pull out htmlparser but do need an icon or logo
import * as async from 'async';

export default {

    provides: 'domain_icons',

    getLinks: function(domain_icons) {
        return domain_icons;
    },

    getData: function(url, iframelyRun, cache, log, options, cb) {

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

        const FALLBACK_ICONS = [{
            href: CONFIG.FALLBACK_ICONS && CONFIG.FALLBACK_ICONS[domain] || `${domainUri}/favicon.ico`,
            type: CONFIG.T.image,
            rel: [CONFIG.R.icon, CONFIG.R.iframely] // It will be validated as image.
        }];

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
                        domain_icons: data.length > 0 ? data : FALLBACK_ICONS
                    });

                } else {

                    if (!options.forceSyncCheck) {
                        // On cache miss hard code domain icon to favicon.ico.

                        cb(null, {
                            domain_icons: FALLBACK_ICONS
                        }); 
                    }

                    // and asynchronously put in cache for next time
                    // + run icons validation right away

                    // forceSyncCheck - ask 'checkFavicon' to check favicon this time before callback.
                    var options2 = Object.assign({}, options, {forceSyncCheck: true});
                    delete options2._usedProviderOptions;

                    iframelyRun(domainUri, options2, function(error, data) {

                        var icons;

                        if (data && data.links) {

                            // do need to set cache here as domains may redirect, 
                            // e.g. http ->https, then http urls will always miss icons.

                            icons = data.links.filter(function(link) {
                                return link.rel.indexOf(CONFIG.R.icon) > -1;
                            });
                        } else {
                            log('[domain-icons] no icons for', domainUri);
                            icons = [];
                        }
                        
                        if (options.forceSyncCheck) {
                            // skip domain icon on cache miss 
                            cb(null, {domain_icons: icons && icons.length > 0 ? icons : FALLBACK_ICONS}); 
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