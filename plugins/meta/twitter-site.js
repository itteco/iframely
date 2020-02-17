module.exports = {

    lowestPriority: true,

    getMeta: function(url, twitter) {

    	var site = (twitter.site && twitter.site.value) || twitter.site;
    	if (!site || typeof site !== 'string') {return;}

    	site = site.replace(/^@/, '');

    	if (url.indexOf(site.toLowerCase())) {
	        return {
	            site: site
	        }
    	}
    }
};