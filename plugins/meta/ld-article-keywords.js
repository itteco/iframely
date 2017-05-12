module.exports = {

    getMeta: function(ld) {

    	if (ld.NewsArticle && ld.NewsArticle.keywords && ld.NewsArticle.keywords instanceof Array) {
	        return {
	        	keywords: ld.NewsArticle.keywords.join(', ')
	        }
    	}
    }
};