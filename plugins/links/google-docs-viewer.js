module.exports = {

    getLink: function(url, nonHtmlContentType) {

    	if (nonHtmlContentType.match(/application\/pdf/)) {
	        return {
	            href: "https://docs.google.com/viewer?embedded=true&url=" + encodeURIComponent(url),
	            type: CONFIG.T.text_html,
	            rel: CONFIG.R.reader,
	            "aspect-ratio": 1 / Math.sqrt(2) // standard sqrt(2) aspect for A4 and other standard A* format papers (except North America, of course)
	        }
    	}
    }
};