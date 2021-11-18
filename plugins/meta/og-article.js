export default {

    getMeta: function(meta) {

        var article = (meta.og && meta.og.article) || meta.article;

        var k = article ? article.tag : null;

        if (k && k instanceof Array) {
            k = k.join(', ');
        }

        if (k && typeof k !== "string") {
            k = null;
        }

        if (article) {
            return {
                author: article.author,
                category: article.section,
                keywords: k
            };
            // example - http://www.entrepreneur.com/article/237644
            // https://open.bufferapp.com/customer-development-interviews-using-twitter/
        }
    }
};