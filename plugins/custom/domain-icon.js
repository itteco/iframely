// use this mixin for domain plugins where you do not want to pull out htmlparser but do need an icon or logo

var core = require('../../lib/core');
var cache = require('../../lib/cache');
var _ = require('underscore');
var async = require('async');

module.exports = {

    provides: 'domain_data',

    getLinks: function(url, domain_data) {

        var links = domain_data.links.filter(function(link) {
            var match = _.intersection(link.rel, [CONFIG.R.icon, CONFIG.R.logo]);
            return match.length;
        });

        if (!links.length > 0) {
            // Do not return links if have no icons or logo.
            return;
        }

        return links.map(function(link) {

            var m = {};
            CONFIG.MEDIA_ATTRS.forEach(function(attr) {
                if (attr in link) {
                    m[attr] = link[attr];
                    delete link[attr];
                }
            });
            if (!_.isEmpty(m)) {
                link.media = m;
            }
            // link.rel.push('promo');
            return link;
        });
    },

    getData: function(url, cb) {

        // find domain and protocol
        var domain, protocol;
        var m = url.toLowerCase().match(/^(https?:\/\/)([^/]+)\/(.)/i);
        
        if (m) {
            domain = m[2];
            protocol = m[1];
        } else {
            // also prevent self recursion for root domains like http://domain.com.
            return cb();
        }

        var domain_key = 'domain:' + domain;

        async.waterfall([

            function(cb) {
                cache.get(domain_key, cb);
            },

            function(data, cb) {

                if (data) {

                    cb(null, {
                        domain_data: data
                    });

                } else {

                    core.run(protocol + domain, function(error, data) {
                        cb(error, {
                            domain_data: data
                        });

                        cache.set(domain_key, data);
                    });
                }
            }

        ], function(error, data) {
            return cb(null, data);
        });

    }

};