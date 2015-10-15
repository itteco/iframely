var utils = require('../../utils');

module.exports = {

    provides: 'self',

    getData: function(meta) {
        return {
            decode: function(text) {
                return utils.encodeText(meta.charset, text);
            }
        };
    }

};