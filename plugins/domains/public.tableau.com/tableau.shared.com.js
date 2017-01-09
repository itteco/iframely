module.exports = {

    re: /^https?:\/\/public\.tableau\.com\/shared\/([a-zA-Z0-9_]+)/i,    

    getLink: function(og, cb) {

    	if (og.image && /^https?:\/\/public\.tableau\.com\/thumb\/views\/([^\/]+)\/([^\/\?#]+)/i.test(og.image || og.image.src)) {

    		var imgMatch = (og.image || og.image.src).match(/^https?:\/\/public\.tableau\.com\/thumb\/views\/([^\/]+)\/([^\/\?#]+)/i);

	        cb ({
	            redirect: 'http://public.tableau.com/views/' + imgMatch[1] + '/' + imgMatch[2]
	        });

    	} else {
    		cb(null);
    	}
    },

    getData: function(urlMatch, options, cb) {

        if (!options.redirectsHistory) {

            cb ({
                redirect: 'https://public.tableau.com/shared/' + urlMatch[1] + '?:embed=y&:showVizHome=no'
            });            

        } else {
            cb(null);
        }
    },    

    tests: [{
        noFeeds: true
    }]
};