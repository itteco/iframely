import * as utils from '../../../lib/utils.js';

export default {

    getData: function(readability, meta, __is_general_article) {

        return {
            safe_html: utils.encodeText(meta.charset, readability.getHTML())
        };
    }
};