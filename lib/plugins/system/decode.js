import * as utils from '../../utils.js';

export default {

    provides: 'self',

    getData: function(meta) {
        return {
            decode: function(text) {
                return utils.encodeText(meta.charset, text);
            }
        };
    }

};