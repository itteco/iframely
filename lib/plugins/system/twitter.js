module.exports = {

    provides: 'self',

    getData: function(meta) {
    	if (meta.twitter) {

    		var twitter = meta.twitter;
    		if (twitter.player && twitter.player instanceof Array) {
    			twitter.player = twitter.player[0];
    		}
    		if (twitter.image && twitter.image instanceof Array) {
    			twitter.image = twitter.image[0];
    		}
	        return {
	            twitter: twitter
	        };
    	}
    }
};