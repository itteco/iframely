module.exports = {

    re: [
        /^https?:\/\/\w{2}\.pinterest(?:\.com?)?\.\w{2,3}/i,
        /^https?:\/\/\w{2,3}\.pinterest(?:\.com?)?\.\w{2,3}\/pin\/(\d+)/i
    ],

    // for example, https://au.pinterest.com/pin/80783387037637534/
    // https://www.pinterest.com/pin/AVrCsLXrlVATjdkqI-KuNc6SnXr3aVTnuxoVrXzJHtphdBTjtymDkS4/

    getLink: function(url, og, options, cb) {

    	if (og.url && url != og.url && (!options.redirectsHistory || options.redirectsHistory.indexOf(og.url) === -1)) {

	        cb ({
	            redirect: og.url
	        });

    	} else {

	        cb (null);

    	}
    }

};