var utils = require('../../../lib/utils');

module.exports = {

    getData: function(readability, meta, __is_general_article) {

        return {
            safe_html: utils.encodeText(meta.charset, readability.getHTML())
        };
    }
};