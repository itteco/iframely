module.exports = {

    re: require('./usatoday.com').re,

    provides: '__allowEmbedURL',

    getData: function(options) {
    	return {
    		__allowEmbedURL: true
    	}
    }

}