// use this mixin for domain plugins where you do not want to pull out htmlparser but do need an icon or logo

var core = require('../../lib/core');
var cache = require('../../lib/cache');
var async = require('async');
var favicon = require('../links/favicon');

module.exports = {

    provides: 'domain_meta',

    getLinks: function(domain_meta) {
        return favicon.getLink(domain_meta);
    },

    getData: function(url, whitelistRecord, cb, options) {

        // find domain and protocol
        var domain, protocol;
        var m = url.toLowerCase().match(/^(https?:\/\/)([^/]+)\/(.)/i);
        
        if (m && (m[1] + m[2] !== url)) {
            domain = m[2];
            protocol = m[1];
        } else {
            // also prevent self recursion for root domains like http://domain.com.
            // TODO: get domain icon from current url meta.
            return cb();
        }

        var domainUri = protocol + domain;

        // Same key as in cachedMeta.js
        var key = 'meta:' + domainUri;

        var whitelistHash = whitelistRecord && whitelistRecord.getRecordHash();
        if (whitelistHash) {
            key += ':' + whitelistHash;
        }        

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

                    // skip domain icon on cache miss 
                    cb (null, null); 

                    // and asynchronously put in cache for next time
                    // + run icons validation right away

                    core.run(domainUri, options, function(error, data) {
                    // don't really have to do anything. 
                    // domain's meta will be stored in cache by core.run                                                
                    });
                }
            }

        ], function(error, data) {
            return cb(null, data);
        });
    }

};