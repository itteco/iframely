export default {

    getData: function(readability, meta, __is_general_article, utils) {

        return {
            safe_html: utils.encodeText(meta.charset, readability.getHTML())
        };
    }
};