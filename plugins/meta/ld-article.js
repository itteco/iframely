module.exports = {

    getMeta: function(ld) {

    	if (ld.NewsArticle) {
	        return {
	        	title: ld.NewsArticle.headline,
	        	date: ld.NewsArticle.dateCreated, 
	        	category: ld.NewsArticle.articleSection
	        }
    	}
    },

    getLink: function(ld) {

    	if (ld.NewsArticle && ld.NewsArticle.thumbnailUrl) {
	        return {
	        	href: ld.NewsArticle.thumbnailUrl,
	        	type: CONFIG.T.image,
	        	rel: CONFIG.R.thumbnail
	        }
    	}
    }

    // ex: 
    // http://www.app.com/story/entertainment/music/2017/03/17/springsteen-legacy-apmff-upstage-film-explores-1970-asbury-park/99313864/
    // https://www.nhl.com/video/oshie-buries-ppg-with-a-backhand/c-51625603?tcid=tw_video_content_id
};