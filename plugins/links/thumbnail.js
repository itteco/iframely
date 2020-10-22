var utils = require('./utils');

module.exports = {

    getLink: function(meta) {
    	if (!meta.og && !meta.og.image) {
        	return utils.getImageLink("thumbnail", meta);
    	}
    }
};