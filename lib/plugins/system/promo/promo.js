var core = require('../../../core');
var _ = require('underscore');

module.exports = {

    provides: 'self',

    getData: function(url, __promoUri, options, cb) {

        if (url === __promoUri) {
            // Prevent self recursion.
            return cb();
        }

        var options2 = _.extend({}, options, {debug: false});
        delete options2.promoUri;

        core.run(__promoUri, options2, function(error, data) {
            cb(error, {
                promo: data
            });
        });
    },

    getMeta: function(__promoUri, promo) {
        return {
            promo: promo.meta.canonical || __promoUri
        };
    },

    getLinks: function(__promoUri, promo) {

        var hasGoodLinks = false;
        var links = promo.links.filter(function(link) {
            var match = _.intersection(link.rel, CONFIG.PROMO_RELS);
            if (match.length > 1 || (match.length > 0 && match.indexOf(CONFIG.R.thumbnail) === -1)) {
                // Detect if has something except thumbnail.
                hasGoodLinks = true;
            }
            return match.length;
        });

        if (!hasGoodLinks) {
            // Do not return links if have no good links excluding thumbnail.
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
            link.rel.push('promo');
            return link;
        });
    }
};