export default {

    getMeta: function(meta) {

        var k = meta.news_keywords || meta.keywords || meta.metaKeywords;

        if (!k && meta.article && meta.article.tag) {
            k = meta.article.tag;
        }

        if (k instanceof Array) {
            k = k.join(', ');
        }

        if (typeof k !== "string") {
            k = null;
        }        

        return {
            keywords: k
        };
    }
};