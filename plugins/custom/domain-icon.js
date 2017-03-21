// use this mixin for domain plugins where you do not want to pull out htmlparser but do need an icon or logo

var core = require('../../lib/core');
var cache = require('../../lib/cache');
var findWhitelistRecordFor = require('../../lib/whitelist').findWhitelistRecordFor;
var _ = require('underscore');
var async = require('async');

var favicon = require('../links/favicon');
var logo = require('../links/logo');

module.exports = {

    provides: 'domain_links',

    getLinks: function(domain_links) {

        var links = domain_links.favicons;

        if (domain_links.logo) {
            links.push(domain_links.logo);
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
            // TODO: get domain icon from current url meta.
            return cb();
        }

        var domainUri = protocol + domain;

        // Same key as in cachedMeta.js
        var key = 'domain_links:' + domain;

        async.waterfall([

            function(cb) {
                cache.get(key, cb);
            },

            function(data, cb) {

                if (data) {

                    cb(null, {
                        domain_links: data
                    });

                } else {

                    core.run(domainUri, {
                        fetchParam: 'meta',
                        getWhitelistRecord: findWhitelistRecordFor
                    }, function(error, meta) {

                        var links = {favicons: favicon.getLink(meta)};
                        var logoLink = logo.getLink(meta);

                        if (logoLink) {
                            links.logo = logoLink;
                        }

                        if (!error) {
                            cache.set(key, links);
                        }

                        cb(error, {
                            domain_links: links
                        });
                    });
                }
            }

        ], function(error, data) {
            return cb(null, data);
        });
    }

};