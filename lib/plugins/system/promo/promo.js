var core = require('../../../core');
var _ = require('underscore');

module.exports = {

    provides: 'self',

    getMeta: function(promo) {
        return {
            promo: promo.meta
        }
    },

    getLinks: function(promo) {
        return promo.links.map(function(link) {
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
    },

    getData: function(__promoUri, options, cb) {

        var options2 = _.extend({}, options, {debug: false});
        delete options2.promoUri;

        core.run(__promoUri, options2, function(error, data) {
            cb(error, {
                promo: data
            });
        });
    }
};