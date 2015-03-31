module.exports = {

    getMeta: function(meta) {

        var article = (meta.og && meta.og.article) || meta.article;

        var k = article.tag;

        if (k instanceof Array) {
            k = k.join(', ');
        }

        if (typeof k !== "string") {
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