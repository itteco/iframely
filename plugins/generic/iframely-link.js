var utils = require('./utils');
var _ = require('underscore');

module.exports = {

    getLinks: function(meta) {
        return _.flatten(_.keys(meta).map(function(key) {
            return utils.parseMetaLinks(key, meta[key]);
        }));
    }
};