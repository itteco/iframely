export default {

    getMeta: function(ld) {

        if (ld.article?.keywords && ld.article.keywords instanceof Array) {
            return {
                keywords: ld.article.keywords.join(', ')
            }
        }
    }
};