module.exports = {

    useAlways: true,

    getMeta: function(meta) {

        var k = meta.keywords || meta.metaKeywords || meta.news_keywords;

        if (k instanceof Array) {
            k = k[0];
        }

        if (!k && meta.article && meta.article.tag) {
            k = meta.article.tag;
            if (k instanceof Array) {
                k = k.join(', ');
            }
            if (typeof k !== "string") {
                k = null;
            }
        }

        return {
            keywords: k
        };
    }
};