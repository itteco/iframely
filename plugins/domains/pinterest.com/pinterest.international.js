module.exports = {

    re: [
        /^https?:\/\/\w{2}\.pinterest\.com\//i,
        /^https?:\/\/\w{2,3}\.pinterest\.com\/pin\/(\D*)/i
    ],

    //for example, https://au.pinterest.com/pin/80783387037637534/
    // https://www.pinterest.com/pin/AVrCsLXrlVATjdkqI-KuNc6SnXr3aVTnuxoVrXzJHtphdBTjtymDkS4/

    getLink: function(url, og, cb) {

    	if (og.url && url != og.url) {

	        cb ({
	            redirect: og.url
	        });

    	} else {

	        cb (null);

    	}
    }

};