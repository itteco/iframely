// use this mixin for domain plugins where you do not want to pull out htmlparser but do need an icon or logo

var core = require('../../lib/core');
var cache = require('../../lib/cache');
var _ = require('underscore');
var async = require('async');

var favicon = require('../links/favicon');
var logo = require('../links/logo');

module.exports = {

    provides: 'domain_meta',

    getLinks: function(domain_meta) {

        var links = favicon.getLink(domain_meta);
        var logoLink = logo.getLink(domain_meta);

        if (logoLink) {
            links.push(logoLink);
        }

        return links;
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

        var domainUri = protocol + domain;

        // Same key as in cachedMeta.js
        var key = 'meta:' + domainUri;

        async.waterfall([

            function(cb) {
                cache.get(key, cb);
            },

            function(data, cb) {

                if (data) {

                    cb(null, {
                        domain_meta: data
                    });

                } else {

                    core.run(domainUri, {
                        fetchParam: 'meta'
                    }, function(error, meta) {

                        cb(error, {
                            domain_meta: meta
                        });

                        cache.set(key, meta);
                    });
                }
            }

        ], function(error, data) {
            return cb(null, data);
        });
    }

};