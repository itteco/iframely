module.exports = {

    getMeta: function(meta) {

    	var article = (meta.og && meta.og.article) || meta.article;

        if (article) {
	        return {
	            author: article.author,
	            category: article.section,
	            keywords: article.tag
	        };
	        // example - http://www.entrepreneur.com/article/237644
	        // https://open.bufferapp.com/customer-development-interviews-using-twitter/
    	}
    }
};