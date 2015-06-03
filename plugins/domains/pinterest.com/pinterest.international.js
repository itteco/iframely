module.exports = {

    re: [
        /^https?:\/\/(gr|in|it|cz|id|es|uk|ru|nl|br|no|tr|pl|fr|ro|de|hu|fi|dk|jp|pt|kr|se|sk)\.pinterest\.com\//i
    ],

    //for example, https://fr.pinterest.com/pin/347973508683865484/

	mixins: false,

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