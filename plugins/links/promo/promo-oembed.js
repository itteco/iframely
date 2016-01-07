var urlLib = require('url');

module.exports = {

    provides: '__promoUri',

    getData: function(oembedLinks, whitelistRecord) {

		if (whitelistRecord.isAllowed && whitelistRecord.isAllowed('html-meta.promo')) {    	

	        var href = oembedLinks[0].href;
	        var self_endpoint = false;

	        if (CONFIG.SELF_OEMBED_POINT_RE_LIST) {
	            var i;
	            for(i = 0; i < CONFIG.SELF_OEMBED_POINT_RE_LIST.length && !self_endpoint; i++) {
	                self_endpoint = href.match(CONFIG.SELF_OEMBED_POINT_RE_LIST[i]);
	            }
	        }

	        if (self_endpoint) {

	            var urlObj = urlLib.parse(href, true);
	            var promo = urlObj.query.promo;

	            if (promo && promo.match(/https?:\/\/.+/i)) {

	                return {
	                    __promoUri: promo
	                };
	            }
	        }

    	}
    }
};