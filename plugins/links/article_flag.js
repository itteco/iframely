module.exports = {

	notPlugin:  !(CONFIG.providerOptions.readability && CONFIG.providerOptions.readability.enabled === true),
	provides: 'readability_flag',

    getData: function(og) {

    	if (og.type === "article") {

	        return {
	            readability_flag: true
	        };
    	}
    }
};