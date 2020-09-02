module.exports = {

    re: require('./twitter.timelines').re,

    getData: function(url, __statusCode, cb) {
    	if (__statusCode === 429) {
    		return cb(null, null)
    	} else {
	        cb ({
				responseStatusCode: __statusCode
	        });
	    }
    }
};