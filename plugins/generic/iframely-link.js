var utils = require('./utils');
var _ = require('underscore');

module.exports = {

    getLinks: function(meta) {
        return _.flatten(_.keys(meta).map(function(key) {
            return utils.parseMetaLinks(key, meta[key]);
        }));
    },

    tests: [{
        page: "http://crowdranking.com/",
        selector: ".name"
    },
        "http://crowdranking.com/crowdrankings/t255g0--die-schoensten-cabrios-aller-zeiten"
    ]
};