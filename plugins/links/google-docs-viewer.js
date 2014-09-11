module.exports = {

    getLink: function(url, nonHtmlContentType) {

    	if (nonHtmlContentType.match(/application\/pdf/)) {
	        return {
	            href: "https://docs.google.com/viewer?embedded=true&url=" + encodeURIComponent(url),
	            type: CONFIG.T.text_html,
	            rel: CONFIG.R.reader
	        }
    	}
    }
};