module.exports = {

    getMeta: function(og) {

        if (og.article) {
	        return {
	            author: og.article.author,
	            category: og.article.section,
	            keywords: og.article.tag
	        };
	        // example - http://www.entrepreneur.com/article/237644
    	}
    }
};