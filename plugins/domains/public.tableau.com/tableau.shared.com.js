module.exports = {

    re: /^https?:\/\/public\.tableau\.com\/shared\/[a-zA-Z0-9_]+/i,

    getLink: function(og, cb) {

    	if (og.image && /^https?:\/\/public\.tableau\.com\/thumb\/views\/([^\/]+)\/([^\/\?#]+)/i.test(og.image || og.image.src)) {

    		var urlMatch = (og.image || og.image.src).match(/^https?:\/\/public\.tableau\.com\/thumb\/views\/([^\/]+)\/([^\/\?#]+)/i);

	        cb ({
	            redirect: 'http://public.tableau.com/views/' + urlMatch[1] + '/' + urlMatch[2]
	        });

    	} else {
    		cb(null);
    	}
    },

    tests: [{
        noFeeds: true
    }]
};