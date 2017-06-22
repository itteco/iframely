// use this mixin for domain plugins where you do not want to pull out htmlparser but do need an icon or logo

var core = require('../../lib/core');
var cache = require('../../lib/cache');
var async = require('async');

module.exports = {

    provides: 'domain_icons',

    getLinks: function(domain_icons) {
        return domain_icons;
    },

    getLinks: function(url, cb, options) {

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
        var key = 'domain_icon:' + domain;

        async.waterfall([

            function(cb) {
                cache.get(key, cb);
            },

            function(data, cb) {

                if (data) {

                    cb(null, {
                        domain_icons: data
                    });

                } else {

                    // skip domain icon on cache miss 
                    cb (null, null); 

                    // and asynchronously put in cache for next time
                    // + run icons validation right away

                    core.run(domainUri, options, function(error, data) {
                        if (data && data.links) {

                            // do need to set cache here as domains may redirect, 
                            // e.g. http ->https, then http urls will always miss icons.
                            cache.set(key, data.links.filter(function(link) {
                                return link.rel.indexOf(CONFIG.R.icon) > -1;
                            }), {ttl: CONFIG.IMAGE_META_CACHE_TTL});
                        } else {
                            cache.set(key, [], {ttl: CONFIG.IMAGE_META_CACHE_TTL});
                        }
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