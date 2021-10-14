import * as utils from './utils.js';
import * as _ from 'underscore';

export default {

    getLinks: function(meta, whitelistRecord) {
        return _.flatten(_.keys(meta).map(function(key) {
            return utils.parseMetaLinks(key, meta[key], whitelistRecord);
        }));
    }
};