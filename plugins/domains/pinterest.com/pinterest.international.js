module.exports = {

    re: [
        /^https?:\/\/\w{2}\.pinterest\.com\//i
    ],

    //for example, https://au.pinterest.com/pin/80783387037637534/

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